<template>
  <v-overlay absolute
    :value="show"
    :fullscreen="fullscreen"
    persistent
    opacity="0"
  >
    <v-card style="width:800px" light>
      <v-toolbar dense elevation="1" color="grey darken-3" dark>
        <v-toolbar-title>{{titleData}} - {{country}}</v-toolbar-title>
        <v-spacer />
        <!-- <v-btn icon @click="toggleScreen" :disabled="loading">
          <v-icon>{{screenIcon}}</v-icon>
        </v-btn> -->
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="chart-container mt-2" style="overflow:hidden">
        <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
        <v-overlay :value="loading||inputLoading" color="rgba(255,255,255, 0.5)" absolute>
          <v-progress-circular indeterminate color="primary" />
        </v-overlay>
      </div>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  computed: {
    screenIcon () {
      return this.fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'
    },
    titleData () {
      return this.dailyChange ? 'Daily Change' : 'Cummulative'
    }
  },
  data () {
    return {
      chartOptions: {
        chart: {
          id: 'lin_chart',
          toolbar: {
            tools: { download: false }
          }
        },
        colors: ['#00B0FF', '#FF1744', '#00E676', '#FF9100'],
        stroke: { width: 2 },
        xaxis: { type: 'datetime' },
        legend: {
          offsetY: 8,
          itemMargin: { vertical: 8 },
        }
      },
      series: [],
      fullscreen: false,
      loading: false,
    }
  },
  methods: {
    close () {
      this.$emit('update:show', false)
    },
    fetchCountryStats () {
      this.series = []
      this.loading = true
      const params = { origin: this.origin, level: this.level, span: this.span }
      // Fetch
      this.$axios.get(`/v1.0/covid-stats/countries/${this.code}`, { params })
      .then(({ data }) => { this.structureData(data, this.type, this.dailyChange) })
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
    toggleScreen () {
      this.fullscreen = !this.fullscreen
    }
  },
  watch: {
    show (yes) {
      if (yes) {
        if (!this.inputLoading) {
          if (this.inputData) {
            this.structureData(this.inputData, this.type, this.dailyChange)
          } else this.fetchCountryStats()
        }
      }
    },
    inputData (data) {
      if (data) this.structureData(data, this.type, this.dailyChange)
    },
    inputLoading (yes) {
      if (yes) this.series = []
    }
  },
  props: {
    code : String,
    country: { type: String, default: 'Country' },
    level: { type: String|Number, default: '0' },
    inputData: Object,
    inputLoading: { type: Boolean, default: false },
    origin: { type: String, default: 'self' },
    show: { type: Boolean, default: false },
    span: { type: String, default: 'past' },
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