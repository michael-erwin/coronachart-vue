<template>
  <v-dialog
    :value="show"
    :fullscreen="fullscreen"
    max-width="800"
    persistent
  >
    <v-card>
      <v-toolbar dense elevation="1" color="primary" dark>
        <v-toolbar-title>Trend - {{country}}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="toggleScreen" :disabled="loading">
          <v-icon>{{screenIcon}}</v-icon>
        </v-btn>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="chart-container" style="overflow:hidden">
        <apexchart v-if="show" type="line" :options="chartOptions" :series="series"></apexchart>
        <v-overlay :value="loading" color="rgba(255,255,255, 0.5)" absolute>
          <v-progress-circular indeterminate color="primary" />
        </v-overlay>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    screenIcon () {
      return this.fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'
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
        colors: ['#ff3333', '#c0c0c0', '#00e600', '#008FFB'],
        stroke: { width: 2 }
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
      this.loading = true
      const apiUrl = `${process.env.VUE_APP_URL}/v2`
      const items = []
      const params = {}
      // Fetch
      this.$axios.get(`${apiUrl}/covid-stats/countries/${this.code}`, params)
      .then((response) => {
        const { data } = response
        const active_set = { name: "Active", data: [] }
        const confirmed_set = { name: "Confirmed", data: [] }
        const deaths_set = { name: "Deaths", data: [] }
        const recovered_set = { name: "Recovered", data: [] }
        // Populate confirmed series
        for (const item of data.items) {
          const { date, added_confirmed, added_deaths, added_recovered, added_active } = item
          const [ yyyy, mm, dd ] = date.split('-')
          const datestring = `${mm}/${dd}/${yyyy}`
          confirmed_set.data.push({ x: datestring, y: added_confirmed })
          deaths_set.data.push({ x: datestring, y: added_deaths })
          recovered_set.data.push({ x: datestring, y: added_recovered })
          active_set.data.push({ x: datestring, y: added_active })
        }
        // Add datasets
        this.series.push(confirmed_set, deaths_set, recovered_set, active_set)
        this.loading = false;
      })
      .catch((e) => {
        console.error(e)
      })
    },
    toggleScreen () {
      this.fullscreen = !this.fullscreen
    }
  },
  watch: {
    show (yes) {
      if (yes) this.fetchCountryStats()
      else this.series = []
    }
  },
  props: {
    code : String,
    country: { type: String, default: 'Country' },
    show: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  min-height: 300px;
}
</style>