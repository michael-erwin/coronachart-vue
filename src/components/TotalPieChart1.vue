<template>
  <v-card class="switch-chart">
    <v-toolbar dense elevation="0">
      <v-toolbar-title class="mt-1">{{title}}</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="dense-field align-start type-selector">
        <v-select
          dense outlined single-line
          class="mt-3"
          v-model="data_type"
          :items="data_types"
          @change="refresh"
          :loading="loading"
        />
      </v-toolbar-items>
    </v-toolbar>
    <div class="pb-3">
      <div class="chart-box">
        <apexchart v-if="render" height="100%" type="pie" :options="options" :series="chart_data" />
      </div>
    </div>
  </v-card>
</template>

<script>
import truncate from 'truncate'
import Formatters from '@/mixins/Formatters'
export default {
  computed: {
    chart_data() {
      return this.series[this.data_type]
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
      items_per_chart: 9,
      data_type: 'confirmed',
      data_types: [
        {text: 'Confirmed', value: 'confirmed'},
        {text: 'Deaths', value: 'deaths'},
        {text: 'Recovered', value: 'recovered'},
        {text: 'Active', value: 'active'},
      ],
      render: false,
      series: {
        confirmed: [],
        deaths: [],
        recovered: [],
        active: [],
      },
      categories_pie: {
        confirmed: [],
        deaths: [],
        recovered: [],
        active: [],
      },
      options: {
        colors: [
          '#F44336','#FF5722','#FF9800','#FFC107','#FFEB3B',
          '#CDDC39','#8BC34A','#4CAF50','#009688','#00BCD4',
        ],
        labels: [],
        legend: { position: 'bottom' },
        tooltip: { y: { formatter: this.thousandSeparator } },
      }
    }
  },
  methods: {
    structureData () {
      this.render = false
      const data = this.data
      // Pie options
      let pie_dataset = []
      let pie_options = { labels: [] }
      // Map values accord to types
      const series_confirmed = []
      const series_deaths = []
      const series_recovered = []
      const series_active = []
      // Placeholder of final aggregated values for chart
      const series_pie = { confirmed: [], deaths: [], recovered: [], active: [] }
      const catgry_pie = { confirmed: [], deaths: [], recovered: [], active: [] }
      // Placeholder of others not included  in items_per_chart.
      const series_confirmed_others = { x: 'Others', y: 0 }
      const series_deaths_others = { x: 'Others', y: 0 }
      const series_recovered_others = { x: 'Others', y: 0 }
      const series_active_others = { x: 'Others', y: 0 }
      // Populate the series category paired values.
      const prefix = this.type === 'density' ? 'density' : 'total'
      for(const item of data.items) {
        const name = truncate(item.country_name, 15)
        series_confirmed.push({x: name, y: item[`${prefix}_confirmed`]})
        series_deaths.push({x: name, y: item[`${prefix}_deaths`]})
        series_recovered.push({x: name, y: item[`${prefix}_recovered`]})
        series_active.push({x: name, y: item[`${prefix}_active`]})
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
          series_pie.confirmed.push(series_confirmed[i].y)
          catgry_pie.confirmed.push(series_confirmed[i].x)
        } else {
          series_confirmed_others.y += series_confirmed[i].y
        }
      }
      series_pie.confirmed.push(series_confirmed_others.y)
      catgry_pie.confirmed.push(series_confirmed_others.x)
      // Deaths
      for (let i=0; i<series_deaths.length; i++) {
        if (i < this.items_per_chart) {
          series_pie.deaths.push(series_deaths[i].y)
          catgry_pie.deaths.push(series_deaths[i].x)
        } else {
          series_deaths_others.y += series_deaths[i].y
        }
      }
      series_pie.deaths.push(series_deaths_others.y)
      catgry_pie.deaths.push(series_deaths_others.x)
      // Recovered
      for (let i=0; i<series_recovered.length; i++) {
        if (i < this.items_per_chart) {
          series_pie.recovered.push(series_recovered[i].y)
          catgry_pie.recovered.push(series_recovered[i].x)
        } else {
          series_recovered_others.y += series_recovered[i].y
        }
      }
      series_pie.recovered.push(series_recovered_others.y)
      catgry_pie.recovered.push(series_recovered_others.x)
      // Active
      for (let i=0; i<series_active.length; i++) {
        if (i < this.items_per_chart) {
          series_pie.active.push(series_active[i].y)
          catgry_pie.active.push(series_active[i].x)
        } else {
          series_active_others.y += series_active[i].y
        }
      }
      series_pie.active.push(series_active_others.y)
      catgry_pie.active.push(series_active_others.x)
      // Set final values for bar
      const suffix = this.type === 'density' ? '/ 1M' : 'count'
      this.series = series_pie
      this.categories_pie = catgry_pie
      this.options.labels = catgry_pie.confirmed
      this.$nextTick(() => { this.render = true })
    },
    refresh (index) {
      // if (this.chart_type == 'pie') {
      //   this.options.pie.labels = this.categories_pie[this.data_type]
      // }
      this.render = false
      this.$nextTick(() => { this.render = true })
    }
  },
  mixins: [ Formatters ],
  props: {
    date: String,
    loading: { type: Boolean, default: false },
    title: { type: String, default: 'Title' },
    size: { type: [Number, String], default: 7 },
    data: { type: Object, default: ()=>{} },
    type: { type: String, default: 'count' },
  },
  watch: {
    data() {
      this.structureData()
    }
  }
}
</script>