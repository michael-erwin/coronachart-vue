<template>
  <v-container fluid>
    <v-row style="position:relative">
      <v-col cols="12" sm="6" md="3">
        <v-card class="single-stat">
          <v-card class="card-icon" color="info">
            <v-icon large color="white">mdi-account-multiple-plus</v-icon>
          </v-card>
          <div class="total-label">
            {{titles[timespan].confirmed}}
          </div>
          <div class="total">
            <v-progress-circular v-if="loading" class="mb-4" color="grey" indeterminate />
            <h1 v-else class="numbers">{{confirmed|thousandSeparator}}</h1>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="single-stat">
          <v-card class="card-icon" color="red darken-1">
            <v-icon large color="white">mdi-account-multiple-minus</v-icon>
          </v-card>
          <div class="total-label">
            {{titles[timespan].deaths}}
          </div>
          <div class="total">
            <v-progress-circular v-if="loading" class="mb-4" color="grey" indeterminate />
            <h1 v-else class="numbers">{{deaths|thousandSeparator}}</h1>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="single-stat">
          <v-card class="card-icon" color="success">
            <v-icon large color="white">mdi-account-multiple-check</v-icon>
          </v-card>
          <div class="total-label">
            {{titles[timespan].recovered}}
          </div>
          <div class="total">
            <v-progress-circular v-if="loading" class="mb-4" color="grey" indeterminate />
            <h1 v-else class="numbers">{{recovered|thousandSeparator}}</h1>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="single-stat">
          <v-card class="card-icon" color="orange darken-1">
            <v-icon large color="white">mdi-account-multiple</v-icon>
          </v-card>
          <div class="total-label">
            {{titles[timespan].active}}
          </div>
          <div class="total">
            <v-progress-circular v-if="loading" class="mb-4" color="grey" indeterminate />
            <h1 v-else class="numbers">{{active|thousandSeparator}}</h1>
          </div>
        </v-card>
      </v-col>
      <ErrorOverlay :title="forbiddenTitle" :show="forbidden" />
    </v-row>
  </v-container>
</template>

<script>
import Formatters from '@/mixins/Formatters'
import ErrorOverlay from '@/components/fragments/ErrorOverlay'
export default {
  components: { ErrorOverlay },
  data () {
    return {
      confirmed: 0,
      deaths: 0,
      recovered: 0,
      active: 0,
      titles: {
        cumulative: {
          confirmed: 'Total Confirmed',
          deaths: 'Total Deaths',
          recovered: 'Total Recovered',
          active: 'Total Active',
        },
        new: {
          confirmed: 'New Confirmed',
          deaths: 'New Deaths',
          recovered: 'New Recovered',
          active: 'New Active',
        }
      }
    }
  },
  mixins: [ Formatters ],
  props: {
    loading: { type: Boolean, default: false },
    data: Object,
    timespan: { type: String, default: 'cumulative' },
    forbidden: { type: Boolean, default: false },
    forbiddenTitle: { type: Boolean|String, default: false }
  },
  watch: {
    data (data) {
      this.confirmed = this.timespan == 'new' ? data.new_confirmed : data.total_confirmed
      this.deaths = this.timespan == 'new' ? data.new_deaths : data.total_deaths
      this.recovered = this.timespan == 'new' ? data.new_recovered : data.total_recovered
      this.active = this.timespan == 'new' ? data.new_active : data.total_active
    },
    timespan () {
      this.confirmed = this.timespan == 'new' ? this.data.new_confirmed : this.data.total_confirmed
      this.deaths = this.timespan == 'new' ? this.data.new_deaths : this.data.total_deaths
      this.recovered = this.timespan == 'new' ? this.data.new_recovered : this.data.total_recovered
      this.active = this.timespan == 'new' ? this.data.new_active : this.data.total_active
    }
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
  .numbers {
    white-space: nowrap;
    font-size: 3vw;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: normal;
    font-family: "Roboto", sans-serif;
  }
  @media (max-width: 960px) {
    .numbers {
      font-size: 6vw;
    }
  }
}
</style>
