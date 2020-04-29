<template>
  <v-card>
    <v-toolbar dense elevation="0">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <div class="chart-container" style="overflow:hidden">
      <apexchart type="line" :options="chartOptions" :series="series" :height="computedHeight"></apexchart>
      <v-overlay :value="loading||inputLoading" color="rgba(255,255,255, 0.5)" absolute>
        <v-progress-circular indeterminate color="primary" />
      </v-overlay>
    </div>
  </v-card>
</template>

<script>
export default {
  computed: {
    computedHeight () {
      return (this.height - 63)
    }
  },
  data () {
    return {
      chartOptions: {
        chart: {
          id: 'lin_chart',
          toolbar: { tools: { download: false } },
        },
        colors: ['#00B0FF', '#FF1744', '#00E676', '#FF9100'],
        stroke: { width: 2 },
        xaxis: { type: 'datetime' },
        legend: {
          offsetY: 8,
          itemMargin: { vertical: 8 },
        }
      },
      data: null,
      series: [],
      fullscreen: false,
      loading: false,
    }
  },
  methods: {
    fetchCountryStats () {
      this.series = []
      this.loading = true
      const params = { origin: this.origin, level: this.level, span: this.span }
      let endpoint = `countries/${this.code}`
      // Fetch
      if (this.code == 'W1') {
        endpoint = 'world'
        params.type = 'series'
      }
      this.$axios.get(`/v2/covid-stats/${endpoint}`, { params })
      .then(({ data }) => { this.data = data; this.structureData(data, this.type, this.dailyChange) })
      .catch((e) => { console.error(e) })
      .finally(() => { this.loading = false })
    },
    structureData (data, type, dailyChange) {
      // Validate
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
    if (!this.inputData) {
      this.fetchCountryStats()
    }
  },
  watch: {
    code (code) {
      this.fetchCountryStats()
    },
    inputData (data) {
      if (data) this.structureData(data, this.type, this.dailyChange)
    },
    inputLoading (yes) {
      if (yes) this.series = []
    },
    dailyChange (dailyChange) {
      console.log('type triggered: ', dailyChange)
      this.structureData(this.data, this.type, this.dailyChange)
    }
  },
  props: {
    code : String,
    height: { type: String|Number, default: '540' },
    level: { type: String|Number, default: '0' },
    inputData: Object,
    inputLoading: { type: Boolean, default: false },
    origin: { type: String, default: 'self' },
    span: { type: String, default: 'past' },
    title: { type: String, default: 'My Line Chart' },
    type: { type: String, default: 'count' },
    dailyChange: { type: Boolean, default: false },
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  min-height: 300px;
}
</style>