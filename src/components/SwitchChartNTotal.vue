<template>
  <v-card class="switch-chart">
    <v-toolbar dense elevation="0">
      <v-toolbar-title class="mt-1">{{title}}</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="dense-field align-start type-selector">
        <v-select
          dense outlined single-line
          class="mt-2"
          v-model="data_type"
          :items="data_types"
          @change="refresh"
          :loading="loading"
        />
      </v-toolbar-items>
    </v-toolbar>
    <div class="pb-3">
      <div class="d-flex justify-center pt-2">
        <v-btn-toggle v-model="chart_index" @change="refresh" dense>
          <v-btn small>Bar</v-btn>
          <v-btn small>Pie</v-btn>
        </v-btn-toggle>
      </div>
      <div class="chart-box">
        <apexchart v-if="render" height="100%"
          :type="chart_type"
          :options="chart_options"
          :series="chart_data"
        />
      </div>
    </div>
  </v-card>
</template>

<script>
import truncate from 'truncate'
export default {
  computed: {
    chart_type() {
      return this.chart_types[this.chart_index]
    },
    chart_data() {
      return this.series[this.chart_types[this.chart_index]][this.data_type]
    },
    chart_options() {
      return this.options[this.chart_types[this.chart_index]]
    },
    pie_labels() {
      return this.categories_pie[this.data_type]
    }
  },
  data () {
    return {
      apiUrl: `${process.env.VUE_APP_URL}/v2`,
      chart_index: 1,
      chart_types: ['bar', 'pie'],
      loading: false,
      items_per_chart: 9,
      data_type: 'total_confirmed',
      data_types: [
        {text: 'Confirmed', value: 'total_confirmed'},
        {text: 'Deaths', value: 'total_deaths'},
        {text: 'Recovered', value: 'total_recovered'},
        {text: 'Active', value: 'total_active'},
      ],
      render: false,
      series: {
        bar: {
          total_confirmed: [],
          total_deaths: [],
          total_recovered: [],
          total_active: [],
        },
        pie: {
          total_confirmed: [],
          total_deaths: [],
          total_recovered: [],
          total_active: [],
        },
      },
      categories_pie: {
        total_confirmed: [],
        total_deaths: [],
        total_recovered: [],
        total_active: [],
      },
      options: {
        bar: {
          chart: { toolbar: { show: false } },
          colors: [
            '#F44336','#FF5722','#FF9800','#FFC107','#FFEB3B',
            '#CDDC39','#8BC34A','#4CAF50','#009688','#00BCD4',
          ],
          dataLabels: { enabled: false },
          legend: { show: false },
          plotOptions: { bar: { columnWidth: '65%', distributed: true, } },
          tooltip: { y: { formatter: this.numberThousands } },
          xaxis: { type: 'category' },
        },
        pie: {
          colors: [
            '#F44336','#FF5722','#FF9800','#FFC107','#FFEB3B',
            '#CDDC39','#8BC34A','#4CAF50','#009688','#00BCD4',
          ],
          labels: [],
          legend: { position: 'bottom' },
          tooltip: { y: { formatter: this.numberThousands } },
        }
      }
    }
  },
  methods: {
    fetchStats () {
      this.loading = true
      // Bar options
      let bar_dataset = { name: this.data_type, data: [] }
      let params = {}
      // Pie options
      let pie_dataset = []
      let pie_options = { labels: [] }
      // Map values accord to types
      const series_confirmed = []
      const series_deaths = []
      const series_recovered = []
      const series_active = []
      // Placeholder of final aggregated values for chart
      const series_bar = { total_confirmed: [], total_deaths: [], total_recovered: [], total_active: [] }
      const series_pie = { total_confirmed: [], total_deaths: [], total_recovered: [], total_active: [] }
      const catgry_pie = { total_confirmed: [], total_deaths: [], total_recovered: [], total_active: [] }
      // Fetch
      if (this.date) params.date = this.date
      this.$axios.get(`${this.apiUrl}/covid-stats/countries`, { params })
      .then ((response) => {
        const { data } = response
        // Placeholder of others not included  in items_per_chart.
        const series_confirmed_others = { x: 'Others', y: 0 }
        const series_deaths_others = { x: 'Others', y: 0 }
        const series_recovered_others = { x: 'Others', y: 0 }
        const series_active_others = { x: 'Others', y: 0 }
        // Populate the series category paired values.
        for(const item of data.items) {
          const name = truncate(item.country_name, 15)
          series_confirmed.push({x: name, y: item.total_confirmed})
          series_deaths.push({x: name, y: item.total_deaths})
          series_recovered.push({x: name, y: item.total_recovered})
          series_active.push({x: name, y: item.total_active})
        }
        // Sort series from highest to lowest.
        series_confirmed.sort((a,b) => b.y - a.y)
        series_deaths.sort((a,b) => b.y - a.y)
        series_recovered.sort((a,b) => b.y - a.y)
        series_active.sort((a,b) => b.y - a.y)
        // Set local series & category values for pie and bar charts
        // Confirmed
        for (let i=0; i<series_confirmed.length; i++) {
          if (i < this.items_per_chart) {
            series_bar.total_confirmed.push(series_confirmed[i])
            series_pie.total_confirmed.push(series_confirmed[i].y)
            catgry_pie.total_confirmed.push(series_confirmed[i].x)
          } else {
            series_confirmed_others.y += series_confirmed[i].y
          }
        }
        series_bar.total_confirmed.push(series_confirmed_others)
        series_pie.total_confirmed.push(series_confirmed_others.y)
        catgry_pie.total_confirmed.push(series_confirmed_others.x)
        // Deaths
        for (let i=0; i<series_deaths.length; i++) {
          if (i < this.items_per_chart) {
            series_bar.total_deaths.push(series_deaths[i])
            series_pie.total_deaths.push(series_deaths[i].y)
            catgry_pie.total_deaths.push(series_deaths[i].x)
          } else {
            series_deaths_others.y += series_deaths[i].y
          }
        }
        series_bar.total_deaths.push(series_deaths_others)
        series_pie.total_deaths.push(series_deaths_others.y)
        catgry_pie.total_deaths.push(series_deaths_others.x)
        // Recovered
        for (let i=0; i<series_recovered.length; i++) {
          if (i < this.items_per_chart) {
            series_bar.total_recovered.push(series_recovered[i])
            series_pie.total_recovered.push(series_recovered[i].y)
            catgry_pie.total_recovered.push(series_recovered[i].x)
          } else {
            series_recovered_others.y += series_recovered[i].y
          }
        }
        series_bar.total_recovered.push(series_recovered_others)
        series_pie.total_recovered.push(series_recovered_others.y)
        catgry_pie.total_recovered.push(series_recovered_others.x)
        // Active
        for (let i=0; i<series_active.length; i++) {
          if (i < this.items_per_chart) {
            series_bar.total_active.push(series_active[i])
            series_pie.total_active.push(series_active[i].y)
            catgry_pie.total_active.push(series_active[i].x)
          } else {
            series_active_others.y += series_active[i].y
          }
        }
        series_bar.total_active.push(series_active_others)
        series_pie.total_active.push(series_active_others.y)
        catgry_pie.total_active.push(series_active_others.x)
        // Set final values for pie
        this.series.bar = {
          total_confirmed: [{name: "Total Confirmed", data: series_bar.total_confirmed}],
          total_deaths: [{name: "Total Deaths", data: series_bar.total_deaths}],
          total_recovered: [{name: "Total Recovered", data: series_bar.total_recovered}],
          total_active: [{name: "Total Active", data: series_bar.total_active}],
        }
        this.series.pie = series_pie
        this.categories_pie = catgry_pie
        this.options.pie.labels = catgry_pie.total_confirmed
        // --
        this.loading = false
        this.render = true
      })
      .catch((e) => { console.error(e) })
    },
    refresh (index) {
      if (this.chart_type == 'pie') {
        this.options.pie.labels = this.categories_pie[this.data_type]
      }
      this.render = false
      this.$nextTick(() => { this.render = true })
    },
    numberThousands(num, opt) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
  },
  props: {
    date: String,
    title: { type: String, default: 'Title' },
    size: { type: [Number, String], default: 7 }
  },
  watch: {
    date(yes) {
      if (yes) this.fetchStats()
    }
  }
}
</script>