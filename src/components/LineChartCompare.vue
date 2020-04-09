<template>
  <v-dialog
    :value="show"
    :fullscreen="fullscreen"
  >
    <v-card>
      <v-toolbar dense elevation="1" color="primary" dark>
        <v-toolbar-title>Compare {{type}}</v-toolbar-title>
        <v-spacer />
        <!-- <v-btn icon @click="toggleScreen" :disabled="loading">
          <v-icon>{{screenIcon}}</v-icon>
        </v-btn> -->
        <div class="select-datatype">
          <v-select
            dense outlined single-line
            class="dense-field mt-1 mr-2"
            v-model="currentSet"
            :items="datasetTypes"
            @change="selectType"
            :loading="loading"
          />
        </div>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div v-if="show" class="chart-container py-4" style="overflow:hidden" :style="{'height':screenHeight+'px'}">
        <apexchart type="line" height="100%" :options="chartOptions" :series="currentSeries"></apexchart>
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
    },
    currentSeries() {
      return this.series[this.currentSet]
    }
  },
  data () {
    return {
      apiUrl: `${process.env.VUE_APP_URL}/v2`,
      chartOptions: {
        chart: {
          id: 'lin_chart',
          toolbar: { tools: { download: false } }
        },
        colors: [
          '#008FFB','#00E396','#FEB019','#FF4560','#775DD0',
          '#33B2DF','#546E7A','#D4526E','#F86624','#A5978B',
        ],
        stroke: { width: 2 }
      },
      currentSet: 'confirmed',
      datasetTypes: [
        {text: 'Confirmed', value: 'confirmed'},
        {text: 'Deaths', value: 'deaths'},
        {text: 'Recovered', value: 'recovered'},
        {text: 'Active', value: 'active'},
      ],
      screenHeight: 720,
      series: {
        confirmed: [],
        deaths: [],
        recovered: [],
        active: [],
      },
      fullscreen: true,
      loading: false,
    }
  },
  methods: {
    close () { this.$emit('update:show', false) },
    fetchCountryStats (code) {
      this.loading = true
      const items = []
      const params = {}
      // Fetch
      this.$axios.get(`${this.apiUrl}/covid-stats/countries/${code}`, params)
      .then((response) => {
        const { data } = response
        const active_set = { name: data.country_name, data: [] }
        const confirmed_set = { name: data.country_name, data: [] }
        const deaths_set = { name: data.country_name, data: [] }
        const recovered_set = { name: data.country_name, data: [] }
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
        this.series.confirmed.push(confirmed_set)
        this.series.deaths.push(deaths_set)
        this.series.recovered.push(recovered_set)
        this.series.active.push(active_set)
        this.loading = false;
      })
      .catch((e) => {
        console.error(e)
      })
    },
    fetchAll() {
      for (const code of this.countryCodes) {
        this.fetchCountryStats(code)
      }
    },
    selectType (type) {

    },
    toggleScreen () {
      this.fullscreen = !this.fullscreen
    }
  },
  watch: {
    show (yes) {
      if (yes) {
        this.series = { confirmed: [], deaths: [], recovered: [], active: [], }
        this.screenHeight = (window.innerHeight - 48)
        this.$nextTick(this.fetchAll)
      }
    }
  },
  props: {
    countryCodes: Array,
    show: { type: Boolean, default: false },
    type: { type: String, default: 'stats' }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  min-height: 300px;
}
.select-datatype {

  max-width: 200px;
}
</style>