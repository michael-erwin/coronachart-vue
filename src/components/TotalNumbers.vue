<template>
  <v-app ref="app" v-resize="resize">
    <v-container fluid>
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
              <h1 class="display-2">{{total_confirmed|thousandSeparator}}</h1>
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
              <h1 class="display-2">{{total_deaths|thousandSeparator}}</h1>
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
              <h1 class="display-2">{{total_recovered|thousandSeparator}}</h1>
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
              <h1 class="display-2">{{total_active|thousandSeparator}}</h1>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  mounted () {
    this.fetchTotalStats()
    this.resize()
  },
  data () {
    return {
      total_confirmed: 0,
      total_deaths: 0,
      total_recovered: 0,
      total_active: 0,
    }
  },
  methods: {
    fetchTotalStats () {
      // this.countries_loading = true
      // Fetch
      const domain = process.env.VUE_APP_URL
      this.$axios.get(`${domain}/v2/covid-stats/total`)
      .then((response) => {
        const data = response.data
        const { total_confirmed, total_deaths, total_recovered, total_active } = data
        this.total_confirmed = total_confirmed
        this.total_deaths = total_deaths
        this.total_recovered = total_recovered
        this.total_active = total_active
        // this.countries_loading = false
      })
      .catch((e) => { console.error(e) })
    },
    resize () {
      const v = this.$refs.app.$el.offsetHeight
      const data = { t: 'r', v }
      parent.postMessage(data, '*')
    }
  },
  filters: {
    thousandSeparator(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
  }
}
</script>

<style lang="scss" scoped>
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
