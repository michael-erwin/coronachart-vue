<template>
  <v-app>
    <fullscreen ref="chart" @change="screenChange">
      <v-sheet flat>
        <v-toolbar dense elevation="0" color="transparent">
          <v-toolbar-title>{{country_name}} ({{type}})</v-toolbar-title>
          <v-spacer />
          <!-- <v-btn icon @click="toggleScreen" :disabled="loading">
            <v-icon>{{screenIcon}}</v-icon>
          </v-btn> -->
        </v-toolbar>
        <div class="chart-container" :style="{height: height+'px' }">
          <apexchart type="line" :options="chartOptions" height="100%" :series="series"></apexchart>
          <v-overlay :value="loading" color="rgba(255,255,255, 0.5)" absolute>
            <v-progress-circular indeterminate color="primary" />
          </v-overlay>
        </div>
      </v-sheet>
    </fullscreen>
  </v-app>
</template>

<script>
export default {
  computed: {
    code () {
      return this.$route.params.code
    },
    height() {
      const match = location.hash.match(/height=(\d+)/)
      const normaHeight = match ? match[1] : 450
      const fullHeight = screen.availHeight
      if (this.fullscreen) return fullHeight
      else return normaHeight
    },
    type() {
      const match = location.hash.match(/type=([a-z]+)/)
      return match ? match[1] : 'basic'
    },
    screenIcon () {
      return this.fullscreen ? 'fullscreen_exit' : 'fullscreen'
    }
  },
  mounted () {
    this.fetchCountryStats()
  },
  data () {
    return {
      country_name: 'Country',
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
          const { date } = item
          const [ yyyy, mm, dd ] = date.split('-')
          const datestring = `${mm}/${dd}/${yyyy}`
          const confirmed = this.type == 'trend' ? item.added_confirmed : item.total_confirmed
          const deaths = this.type == 'trend' ? item.added_deaths : item.total_deaths
          const recovered = this.type == 'trend' ? item.added_recovered : item.total_recovered
          const active = this.type == 'trend' ? item.added_active : item.total_active
          confirmed_set.data.push({ x: datestring, y: confirmed })
          deaths_set.data.push({ x: datestring, y: deaths })
          recovered_set.data.push({ x: datestring, y: recovered })
          active_set.data.push({ x: datestring, y: active })
        }
        // Add datasets
        this.country_name = data.country_name
        this.series.push(confirmed_set, deaths_set, recovered_set, active_set)
        this.loading = false;
      })
      .catch((e) => {
        console.error(e)
      })
    },
    screenChange(screen) {
      this.fullscreen = screen
    },
    toggleScreen () {
      this.$refs['chart'].toggle()
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  overflow: hidden !important;
}
</style>