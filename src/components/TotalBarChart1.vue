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
        <apexchart v-if="render" height="100%" type="bar" :options="options" :series="chart_data" />
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
      options: {
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
    }
  },
  methods: {
    structureData () {
      this.render = false
      const data = this.data
      // Bar options
      let bar_dataset = { name: this.data_type, data: [] }
      // Map values accord to types
      const series_confirmed = []
      const series_deaths = []
      const series_recovered = []
      const series_active = []
      // Placeholder of final aggregated values for chart
      const series_bar = { confirmed: [], deaths: [], recovered: [], active: [] }
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
          series_bar.confirmed.push(series_confirmed[i])
        } else {
          series_confirmed_others.y += series_confirmed[i].y
        }
      }
      series_bar.confirmed.push(series_confirmed_others)
      // Deaths
      for (let i=0; i<series_deaths.length; i++) {
        if (i < this.items_per_chart) {
          series_bar.deaths.push(series_deaths[i])
        } else {
          series_deaths_others.y += series_deaths[i].y
        }
      }
      series_bar.deaths.push(series_deaths_others)
      // Recovered
      for (let i=0; i<series_recovered.length; i++) {
        if (i < this.items_per_chart) {
          series_bar.recovered.push(series_recovered[i])
        } else {
          series_recovered_others.y += series_recovered[i].y
        }
      }
      series_bar.recovered.push(series_recovered_others)
      // Active
      for (let i=0; i<series_active.length; i++) {
        if (i < this.items_per_chart) {
          series_bar.active.push(series_active[i])
        } else {
          series_active_others.y += series_active[i].y
        }
      }
      series_bar.active.push(series_active_others)
      // Set final values for bar
      const suffix = this.type === 'density' ? '/ 1M' : 'count'
      this.series = {
        confirmed: [{name: `Confirmed ${suffix}`, data: series_bar.confirmed}],
        deaths: [{name: `Deaths ${suffix}`, data: series_bar.deaths}],
        recovered: [{name: `Recovered ${suffix}`, data: series_bar.recovered}],
        active: [{name: `Active ${suffix}`, data: series_bar.active}],
      }
      this.$nextTick(() => { this.render = true })
    },
    refresh (index) {
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