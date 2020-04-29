<template>
  <v-card style="position:relative">
    <v-toolbar dense elevation="0">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer />
      <div class="mt-1 mr-n2" style="max-width: 220px">
        <v-autocomplete
          v-model="country_code"
          :disabled="country_loading"
          :loading="country_loading"
          :items="country_list"
          item-text="country_name"
          item-value="country_code"
          :filter="countryFilter"
          cache-items outlined
          flat dense solo
          hide-no-data hide-details
          label="Select your country"
          @change="changeCountry"
        />
      </div>
    </v-toolbar>
    <div class="chart-container" style="overflow:hidden">
      <apexchart type="line" :options="chartOptions" :series="series" :height="computedHeight"></apexchart>
      <div class="d-flex justify-center control">
        <v-btn-toggle v-model="dailyChange" dense mandatory @change="changedDaily">
          <v-btn small :value="false" width="120" title="Daily accumulated count">Cummulative</v-btn>
          <v-btn small :value="true" width="120" title="Daily new incidence"
            :disabled="country_code==='W1'"
          >Daily Change</v-btn>
        </v-btn-toggle>
      </div>
      <v-overlay :value="loading" color="rgba(255,255,255, 0.5)" absolute>
        <v-progress-circular indeterminate color="primary" />
      </v-overlay>
    </div>
    <ErrorOverlay :show="forbidden" style="z-index: 999" />
  </v-card>
</template>

<script>
import ErrorOverlay from '@/components/fragments/ErrorOverlay'
export default {
  components: { ErrorOverlay },
  computed: {
    computedHeight () {
      return (this.height - 63)
    }
  },
  created () {
    this.country_code = this.defaultCode
    console.log('lineChartStandard: ', this.country_code)
  },
  data () {
    return {
      chartOptions: {
        chart: {
          id: 'lin_chart',
          toolbar: { tools: { download: false } }
        },
        colors: ['#00B0FF', '#FF1744', '#00E676', '#FF9100'],
        stroke: { width: 2 },
        xaxis: { type: 'datetime' },
        legend: {
          offsetY: 8,
          itemMargin: { vertical: 8 },
        }
      },
      country_code: 'W1',
      country_list: [{ country_code: 'W1', country_name: 'All (World Total)'}],
      dailyChange: false,
      data: null,
      series: [],
      fullscreen: false,
      loading: false,
      country_loading: false,
      forbidden: false,
    }
  },
  methods: {
    changedDaily (dailyChange) {
      this.structureData (this.data, this.type, dailyChange)
    },
    countryFilter (item, queryText, itemText) {
      const text1 = item.country_code.toLowerCase()
      const text2 = item.country_name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return text1.indexOf(searchText) > -1 || text2.indexOf(searchText) > -1
    },
    changeCountry (country_code) {
      if (country_code === 'W1') this.dailyChange = false
      this.$emit('update:default-code', country_code)
      this.fetchCountryStats()
    },
    fetchCountryStats () {
      this.series = []
      this.loading = true
      const params = { origin: this.origin, level: this.level, span: this.span }
      let endpoint = `countries/${this.country_code}`
      // Fetch
      if (this.country_code == 'W1') {
        endpoint = 'world'
        params.type = 'series'
      }
      this.$axios.get(`/v2/covid-stats/${endpoint}`, { params })
      .then(({ data }) => { this.data = data; this.structureData(data, this.type, this.dailyChange) })
      .catch((e) => { 
        if (e.response) {
          const { status, headers, data} = e.response
          if (status === 401) this.forbidden = true
        }
       })
      .finally(() => { this.loading = false })
    },
    fetchAffectedCountries () {
      this.country_loading = true
      const params = { origin: this.origin, level: this.level, span: this.span }
      this.$axios.get(`/v2/covid-stats/affected-countries`, { params })
      .then(({data}) => {
        let list = [...this.country_list, ...data]
        this.country_list = list
        this.$nextTick(this.fetchCountryStats)
      })
      .catch((e) => { 
        if (e.response) {
          const { status, headers, data} = e.response
          if (status === 401) this.forbidden = true
        }
       })
      .finally(() => this.country_loading = false)
    },
    structureData (data, type, dailyChange) {
      // Validate
      if (!data) return
      if (typeof data !== 'object') return
      if (!data.hasOwnProperty('items')) return
      // Determin prefix to use
      this.series = []
      let pref = 'total'
      if (type === 'count') { if (dailyChange) pref = 'new' }
      else { pref = dailyChange ? 'new_density' : 'density' }
      // Populate sets data
      const active_set = { name: "Active", data: [] }
      const confirmed_set = { name: "Confirmed", data: [] }
      const deaths_set = { name: "Deaths", data: [] }
      const recovered_set = { name: "Recovered", data: [] }
      for (const item of data.items) {
        const { date } = item
        const [ yyyy, mm, dd ] = date.split('-')
        // const datestring = `${mm}/${dd}/${yyyy}` // TODO: convert to local equivalent
        // const datestring = (new Date(date)).getTime()
        // const datestring = `${date}T00:00:00Z`
        const datestring = date
        confirmed_set.data.push({ x: datestring, y: item[`${pref}_confirmed`] })
        deaths_set.data.push({ x: datestring, y: item[`${pref}_deaths`] })
        recovered_set.data.push({ x: datestring, y: item[`${pref}_recovered`] })
        active_set.data.push({ x: datestring, y: item[`${pref}_active`] })
      }
      // Add datasets
      this.series.push(confirmed_set, deaths_set, recovered_set, active_set)
    },
  },
  mounted () {
    this.fetchAffectedCountries()
  },
  props: {
    defaultCode: { type: String, default: 'W1' },
    height: { type: String|Number, default: '540' },
    level: { type: String|Number, default: '0' },
    origin: { type: String, default: 'self' },
    span: { type: String, default: 'past' },
    title: { type: String, default: 'My Country Chart' },
    type: { type: String, default: 'count' },
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  min-height: 300px;
  
}
.chart-container .control {
  width: 100%;
  position: absolute;
  top:2px;
  left:0;
}
</style>