<template>
  <v-card class="embed-data-table" style="position:relative" ref="table_wrapper">
    <v-toolbar elevation="0">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="country-search">
        <v-text-field outlined dense single-line
          max-width="350"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
        />
      </div>
      <!-- <CompareWidgetBtn v-if="compareList.length > 0"
        :items="compareList" :country-names="codeToCountry" :type.sync="compareType"
        @remove="removeCompareItem"
        @clear="compareList=[]"
        @compare="openCompareChart=true"
      /> -->
    </v-toolbar>
    <div class="d-flex justify-center py-2">
      <v-btn-toggle v-model="data_type" dense mandatory @change="typeChanged">
        <v-btn small value="count" width="100" title="Total Incidence Count">Total Case</v-btn>
        <v-btn small value="density" width="100" title="Incidence/1M Population">Per Million</v-btn>
      </v-btn-toggle>
    </div>
    <v-data-table
      :headers="computedHeaders"
      :items.sync="items"
      :search="search"
      :loading="loading"
      :height="computedHeight"
      :sort-by.sync="sort_by"
      :sort-desc.sync="sort_desc"
      @update:items-per-page="resizeHeight"
    >
      <template v-slot:body="{items}">
        <tbody>
          <tr v-for="item in items" :key="item.country_code">
            <td><img class="flag-icon" :src="getFlagLink(item.country_code)"> {{item.country_name}}</td>
            <td><!-- Confirmed -->
              {{item.confirmed|thousandSeparator}}
              <span v-if="item.new_confirmed>0">
                <v-btn x-small outlined class="ma-2 no-click"
                  color="primary" elevation="0" title="change in 24hrs">
                  +{{item.new_confirmed|thousandSeparator}}
                </v-btn>
              </span>
            </td>
            <td><!-- Deaths -->
              {{item.deaths|thousandSeparator}}
              <span v-if="item.new_deaths>0">
                <v-btn x-small outlined class="ma-2 no-click"
                  color="red darken-1" elevation="0" title="change in 24hrs">
                  +{{item.new_deaths|thousandSeparator}}
                </v-btn>
              </span>
            </td>
            <td><!-- Recovered -->
              {{item.recovered|thousandSeparator}}
              <span v-if="item.new_recovered>0">
                <v-btn x-small outlined class="ma-2 no-click"
                  color="success" elevation="0" title="change in 24hrs">
                  +{{item.new_recovered|thousandSeparator}}
                </v-btn>
              </span>
            </td>
            <td><!-- Active -->
              {{item.active|thousandSeparator}}
              <span v-if="item.new_active>0">
                <v-btn x-small outlined class="ma-2 no-click"
                  color="orange darken-3" elevation="0" title="change in 24hrs">
                  +{{item.new_active|thousandSeparator}}
                </v-btn>
              </span>
            </td>
            <td><!-- Actions -->
              <template v-if="item.country_code!=='--'&&data_type==='count'">
                <button class="action-btn" v-ripple 
                  title="View daily stats"
                  @click="viewChart(item, 'cummulative')"
                >
                  <v-icon small class="mr-1">mdi-chart-line</v-icon>
                  <span>Stats</span>
                </button>
                &nbsp;
                <button class="action-btn" v-ripple v-if="item.country_code!=='--'"
                  title="View daily trends"
                  @click="viewChart(item, 'daily_change')"
                >
                    <v-icon small class="mr-1">mdi-trending-up</v-icon>
                    <span>Trend</span>
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <LineChartOverlay
      :daily-change="line_chart.daily"
      :show.sync="line_chart.show"
      :code="line_chart.country_code"
      :country="line_chart.country_name"
      :level="line_chart.level"
      :input-data="line_chart.data"
      :input-loading="line_chart.loading"
      :type="data_type"
    />
    <ErrorOverlay :show="forbidden" />
  </v-card>
</template>

<script>
import Formatters from '@/mixins/Formatters'
import ErrorOverlay from '@/components/fragments/ErrorOverlay'

import LineChartOverlay from '@/components/LineChartOverlay'
export default {
  components: { ErrorOverlay, LineChartOverlay },
  computed: {
    computedHeaders () {
      return [
        { text: 'Country', value: 'country_name' },
        { text: this.data_type=='count'?'Confirmed':'Confirmed/1M', value: 'confirmed' },
        { text: this.data_type=='count'?'Deaths':'Deaths/1M', value: 'deaths' },
        { text: this.data_type=='count'?'Recovered':'Recovered/1M', value: 'recovered' },
        { text: this.data_type=='count'?'Active':'Active/1M', value: 'active' },
        // { text: 'Population', value: 'population' },
        { text: 'Actions', value: 'action', sortable: false },
      ]
    },
    computedHeight () {
      let height = 'auto'
      const input_height = parseInt(this.height)
      if (Number.isInteger(input_height)) {
        height = (input_height > 199) ? (input_height - 156) : 300
      }
      return height
    }
  },
  data () {
    return {
      data_type: 'count',
      footer_props: {},
      items: [],
      search: '',
      sort_by: 'confirmed',
      sort_desc: true,
      line_chart: {
        daily: false,
        data: null,
        show: false,
        country_code: 'US',
        country_name: 'United States',
        level: '0',
        span: 'past',
        loading: false,
      }
    }
  },
  methods: {
    getFlagLink (country_code) {
      return `https://www.countryflags.io/${country_code}/flat/24.png`
    },
    fetchLineData (country_code) {
      this.line_chart.loading = true
      const params = { origin: 'self', level: '0', span: 'past' }
      this.$axios.get(`/v1.0/covid-stats/countries/${country_code}`, { params })
      .then(({ data }) => { this.line_chart.data = data })
      .catch((e) => { console.error(e) })
      .finally(() => { this.line_chart.loading = false })
    },
    resizeHeight () {
      this.$nextTick(()=>{
        const height = this.$refs.table_wrapper.$el.offsetHeight
        this.$emit('resize', height)
      })
    },
    structureData (sort_by='confirmed') {
      this.items = []
      const { date, items } = this.data
      const key_active = (this.data_type === 'density') ? 'density_active' : 'total_active'
      const key_confirmed = (this.data_type === 'density') ? 'density_confirmed' : 'total_confirmed'
      const key_deaths = (this.data_type === 'density') ? 'density_deaths' : 'total_deaths'
      const key_recovered = (this.data_type === 'density') ? 'density_recovered' : 'total_recovered'
      for (const item of items) {
        const {country_name, country_code} = item
        const active = item[key_active]
        const confirmed = item[key_confirmed]
        const deaths = item[key_deaths]
        const recovered = item[key_recovered]
        this.items.push({
          country_name, country_code, active, confirmed, deaths, recovered,
          new_confirmed: this.data_type=='density' ? item.new_density_confirmed : item.new_confirmed,
          new_deaths: this.data_type=='density' ? item.new_density_deaths : item.new_deaths,
          new_recovered: this.data_type=='density' ? item.new_density_recovered : item.new_recovered,
          new_active: this.data_type=='density' ? item.new_density_active : item.new_active,
        })
      }
      this.$nextTick(() => {
        this.sort_by = sort_by
        this.sort_desc = true
      })
    },
    typeChanged (type) {
      // Initial sorting of column
      const sort_by = (type === 'density') ? 'deaths' : 'confirmed'
      this.structureData(sort_by)
    },
    viewChart (item, type) {
      this.line_chart.daily = (type === 'daily_change') ? true : false
      this.line_chart.show = true
      if (item.country_code !== this.line_chart.country_code) {
        this.line_chart.country_code = item.country_code
        this.line_chart.country_name = item.country_name
        this.fetchLineData(item.country_code)
      }
    },
  },
  mixins: [ Formatters ],
  props: {
    data: Object,
    forbidden: { type: Boolean, default: false },
    height: { type: Number|String, default: 'auto' },
    loading: { type: Boolean, default: false },
    title: { type: String, default: 'Data Table - Basic'},
    type: { type: String, default: 'count' }
  },
  watch: {
    data(items) {
      this.structureData()
    }
  }
}
</script>

<style scoped>
.action-btn i,
.action-btn span {
  color: #424242;
  transition: color 300ms ease !important;
}
.action-btn {
  min-width: 80px;
  text-align: center;
  border: 0.5px solid #cccccc;
  border-radius: 4px;
  outline: 0;
  text-transform: uppercase;
  /* background: linear-gradient(to bottom, rgba(176,176,176,0.2) 0%,rgba(176,176,176,0.4) 100%); */
  background-color: rgba(200,200,200,0.1);
  transition: all 500ms ease;
  font-family: Roboto, sans-serif;
  font-size: 0.8em;
  height: 22px;
  line-height: 18px;;
}
.action-btn:hover {
  /* background: linear-gradient(to bottom, rgba(176,176,176,0.3) 0%,rgba(176,176,176,0.5) 100%); */
  color: white !important;
  background: linear-gradient(to bottom, #1976d2c0 0%,#1976d2ff 100%);
  border-color: #1976d2ff;
}
.action-btn:hover * {
  color: white !important;
}
</style>