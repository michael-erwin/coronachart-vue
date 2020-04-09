<template>
  <v-app>
    <!-- Top Bar -->
    <div class="topbar grey lighten-3">
      <v-container>
        <v-row no-gutters>
          <v-col>
            <div class="d-flex align-center">
              <h1 class="title">COVID-19 Cases</h1>
              <v-spacer />
              <div class="date-selector">
                <div class="mt-2 mr-2 d-none d-sm-inline-block">As of </div>
                <v-menu
                  ref="datePicker"
                  v-model="datePicker"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field outlined dense readonly single-line
                      :value="computedDateFormatted"
                      label="Date"
                      append-icon="mdi-calendar"
                      @blur="date = parseDate(dateFormatted)"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="date" no-title @input="datePicker = false"></v-date-picker>
                </v-menu>
              </div>
            </div>
            
          </v-col>
        </v-row>
      </v-container>
       <v-divider />
    </div>
    <v-container>
      <!-- Single Stats -->
      <v-row>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="single-stat">
            <v-card class="card-icon" color="info">
              <v-icon large color="white">mdi-account-multiple-plus</v-icon>
            </v-card>
            <div class="total-label">
              Total Confirmed
            </div>
            <div class="total">
              <h1 class="display-2">{{confirmedTotal|thousandSeparator}}</h1>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="single-stat">
            <v-card class="card-icon" color="red darken-1">
              <v-icon large color="white">mdi-account-multiple-minus</v-icon>
            </v-card>
            <div class="total-label">
              Total Deaths
            </div>
            <div class="total">
              <h1 class="display-2">{{deathTotal|thousandSeparator}}</h1>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="single-stat">
            <v-card class="card-icon" color="success">
              <v-icon large color="white">mdi-account-multiple-check</v-icon>
            </v-card>
            <div class="total-label">
              Total Recovered
            </div>
            <div class="total">
              <h1 class="display-2">{{recoveredTotal|thousandSeparator}}</h1>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="single-stat">
            <v-card class="card-icon" color="orange darken-1">
              <v-icon large color="white">mdi-account-multiple</v-icon>
            </v-card>
            <div class="total-label">
              Total Active
            </div>
            <div class="total">
              <h1 class="display-2">{{activeTotal|thousandSeparator}}</h1>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <!-- Switching Charts -->
      <v-row>
        <v-col cols="12" md="6">
          <switch-chart-n-total title="Incidence" :date="formatedDateToQuery" size="10" />
        </v-col>
        <v-col cols="12" md="6">
          <switch-chart-per-m-total title="Incidence" :date="formatedDateToQuery" size="10" />
        </v-col>
      </v-row>
      <!-- Stats by Country -->
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar elevation="0">
              <v-toolbar-title>By Country</v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <div class="align-center"> -->
                <div class="country-search">
                  <v-text-field outlined dense single-line
                    max-width="350"
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                  />
                </div>
                <CompareWidgetBtn v-if="compareList.length > 0"
                  :items="compareList" :country-names="codeToCountry" :type.sync="compareType"
                  @remove="removeCompareItem"
                  @clear="compareList=[]"
                  @compare="openCompareChart=true"
                />
              <!-- </div> -->
            </v-toolbar>
            <v-data-table
              :headers="headers"
              :items.sync="items"
              :search="search"
              :loading="countries_loading"
            >
              <!-- Country column -->
              <template v-slot:item.country_name="{ item }">
                <div class="d-inline-flex align-center">
                  <div v-if="item.action!=='--'" class="mr-1">
                    <img :src="`https://www.countryflags.io/${item.action}/flat/24.png`" style="vertical-align:top"/>
                  </div>
                  <v-icon v-else class="mr-1">
                    flag
                  </v-icon>
                  <div>{{item.country_name}}</div>
                </div>
              </template>
              <!-- Confirmed column -->
              <template  v-slot:item.confirmed="{ item }">
                {{item.confirmed|thousandSeparator}}
                <span v-if="item.confirmed_new>0">
                  <v-btn x-small outlined class="ma-2 no-click"
                    color="primary" elevation="0" title="change in 24hrs">
                    +{{item.confirmed_new|thousandSeparator}}
                  </v-btn>
                </span>
              </template>
              <!-- Deaths column -->
              <template  v-slot:item.deaths="{ item }">
                {{item.deaths|thousandSeparator}}
                <span v-if="item.deaths_new>0">
                  <v-btn x-small outlined class="ma-2 no-click"
                    color="error" elevation="0" title="change in 24hrs">
                    +{{item.deaths_new|thousandSeparator}}
                  </v-btn>
                </span>
              </template>
              <!-- Recovered column -->
              <template  v-slot:item.recovered="{ item }">
                {{item.recovered|thousandSeparator}}
                <span v-if="item.recovered_new>0">
                  <v-btn x-small outlined class="ma-2 no-click"
                    color="success" elevation="0" title="change in 24hrs">
                    +{{item.recovered_new|thousandSeparator}}
                  </v-btn>
                </span>
              </template>
              <!-- Active column -->
              <template  v-slot:item.active="{ item }">
                {{(item.confirmed - (item.deaths + item.recovered))|thousandSeparator}}
                <!-- {{ item.active }} -->
              </template>
              <!-- Population column -->
              <template  v-slot:item.population="{ item }">
                {{item.population|shortNum}}
                <!-- {{ item.active }} -->
              </template>
              <!-- Actions column -->
              <template  v-slot:item.action="{ item }">
                <v-btn v-if="item.action!=='--'"
                  x-small
                  color="info"
                  elevation="0"
                  title="View daily stats"
                  @click="viewChart(item, 'Stats')"
                >
                  <v-icon small class="mr-1">mdi-chart-line</v-icon>
                  Stats
                </v-btn>
                &nbsp;
                <v-btn v-if="item.action!=='--'"
                  x-small
                  color="red darken-1"
                  class="white--text"
                  elevation="0"
                  title="View daily trends"
                  @click="viewChart(item, 'Trend')"
                >
                  <v-icon small class="mr-1">mdi-trending-up</v-icon>
                  Trend
                </v-btn>
                &nbsp;
                <v-btn v-if="item.action!=='--'"
                  x-small
                  color="success"
                  class="white--text"
                  elevation="0"
                  title="Add to comparison list"
                  :disabled="inCompare(item.action)"
                  @click="addCompareItem(item.action, item.country_name)"
                >
                  <v-icon small class="mr-1">mdi-compare</v-icon>
                  Compare
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <line-chart-country-stats :show.sync="openCountryChartStats" :code="countryCode" :country="countryName" />
    <line-chart-country-trend :show.sync="openCountryChartTrend" :code="countryCode" :country="countryName" />
    <line-chart-compare :show.sync="openCompareChart" :type="compareType" :country-codes="compareList" />
  </v-app>
</template>

<script>
import abbreviate from 'number-abbreviate'
import CompareWidgetBtn from '@/components/CompareWidgetBtn'
import LineChartCompare from '@/components/LineChartCompare'
import LineChartCountryStats from '@/components/LineChartCountryStats'
import LineChartCountryTrend from '@/components/LineChartCountryTrend'
import SwitchChartPerMTotal from '@/components/SwitchChartPerMTotal'
import SwitchChartNTotal from '@/components/SwitchChartNTotal'
export default {
  components: {
    CompareWidgetBtn, LineChartCompare,
    LineChartCountryStats, LineChartCountryTrend, SwitchChartPerMTotal, SwitchChartNTotal
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
    formatedDateToQuery() {
      const [year, month, day] = this.date.split('-')
      const year2 = year[2] + year[3]
      return `${month}/${day}/${year2}`
    },
  },
  created () {
    console.log('apiUrl ', this.apiUrl)
    this.fetchTotalStats()
    this.fetchCountryStats()
  },
  data () {
    return {
      apiUrl: `${process.env.VUE_APP_URL}/v2`,
      init: false,
      compareList: [],
      compareType: 'stats',
      codeToCountry: {},
      date: '',
      datePicker: false,
      dateFormatted: '',
      confirmedTotal: 0,
      deathTotal: 0,
      recoveredTotal: 0,
      activeTotal: 0,
      countries_loading: false,
      search: '',
      headers: [
        { text: 'Country', value: 'country_name' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Deaths', value: 'deaths' },
        { text: 'Recovered', value: 'recovered' },
        { text: 'Active', value: 'active' },
        { text: 'Population', value: 'population' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      items: [],
      openCompareChart: false,
      openCountryChartStats: false,
      openCountryChartTrend: false,
      countryCode: '',
      countryName: '',
    }
  },
  filters: {
    thousandSeparator(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
    shortNum(num) {
      return abbreviate(num, 2)
    }
  },
  methods: {
    addCompareItem(code, name) {
      if (this.compareList.length < 5) {
        if (!this.inCompare(code)) {
          this.codeToCountry[code] = name
          this.compareList.push(code)
        }
      }
    },
    fetchCountryStats () {
      let params = {}
      if (this.init) params.date = this.formatedDateToQuery
      const items = []
      this.countries_loading = true;
      // Fetch
      this.$axios.get(`${this.apiUrl}/covid-stats/countries`, { params })
      .then((response) => {
        const { data } = response
        let countries = []
        // Populate column for confirmed & country entries
        for (const item of data.items) {
          const country = {
            active: item.total_active,
            action: item.country_code,
            country_name: item.country_name,
            confirmed: item.total_confirmed,
            confirmed_new: item.change24_confirmed,
            deaths: item.total_deaths,
            deaths_new: item.change24_deaths,
            recovered: item.total_recovered,
            recovered_new: item.change24_recovered,
            population: item.population,
          }
          countries.push(country)
        }
        // Sort countries according to confirmed cases
        countries.sort((a, b) => b.confirmed - a.confirmed)
        this.items = countries;
        this.countries_loading = false;
        this.init = true;
      })
      .catch((e) => {
        console.error(e)
      })
    },
    fetchTotalStats () {
      // this.countries_loading = true
      // Fetch
      let url = `${this.apiUrl}/covid-stats/total`
      if (this.init) url += `?date=${this.formatedDateToQuery}`
      this.$axios.get(url)
      .then((response) => {
        const data = response.data
        const { date, total_confirmed, total_deaths, total_recovered, total_active } = data
        this.date = date
        this.confirmedTotal = total_confirmed
        this.deathTotal = total_deaths
        this.recoveredTotal = total_recovered
        this.activeTotal = total_active
        // this.countries_loading = false
      })
      .catch((e) => {
        console.error(e)
      })
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    inCompare(code) {
      return this.compareList.indexOf(code) > -1
    },
    parseDate (date) {
      if (!date) return null
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    removeCompareItem(code) {
      const index = this.compareList.indexOf(code)
      if (index > -1) this.compareList.splice(index, 1)
    },
    viewChart(data, type) {
      const keyName = `openCountryChart${type}`
      this.countryCode = data.action
      this.countryName = data.country_name
      this[keyName] = true
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
      if (this.init) {
        this.fetchTotalStats()
        this.fetchCountryStats()
      } else {
        this.init = true
      }
    },
  },
}
</script>

<style scoped lang="scss">
.no-click {
  cursor: default;
}
.date-selector {
  display: inline-flex;
  align-items: top;
  max-width: 200px;
  white-space: nowrap;
}
@media (max-width: 560px) {
  .date-selector {
    max-width: 140px;
  }
}
.single-stat {
  min-height: 120px;
  margin-top: 40px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .total { font-weight: 300; text-align: right; }
  .total-label { text-align: right; }
  .card-icon {
    position: absolute;
    top: 0; left: 0;
    width: 80px;
    height: 80px;
    transform: translate(16px, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
