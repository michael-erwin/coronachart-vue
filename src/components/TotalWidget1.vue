<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="single-stat">
          <v-card class="card-icon" color="info">
            <v-icon large color="white">mdi-account-multiple-plus</v-icon>
          </v-card>
          <div class="total-label">
            {{titles[type].confirmed}}
          </div>
          <div class="total">
            <v-progress-circular v-if="loading" class="mb-4" color="grey" indeterminate />
            <h1 v-else class="display-2">{{confirmed|thousandSeparator}}</h1>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="single-stat">
          <v-card class="card-icon" color="red darken-1">
            <v-icon large color="white">mdi-account-multiple-minus</v-icon>
          </v-card>
          <div class="total-label">
            {{titles[type].deaths}}
          </div>
          <div class="total">
            <v-progress-circular v-if="loading" class="mb-4" color="grey" indeterminate />
            <h1 v-else class="display-2">{{deaths|thousandSeparator}}</h1>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="single-stat">
          <v-card class="card-icon" color="success">
            <v-icon large color="white">mdi-account-multiple-check</v-icon>
          </v-card>
          <div class="total-label">
            {{titles[type].recovered}}
          </div>
          <div class="total">
            <v-progress-circular v-if="loading" class="mb-4" color="grey" indeterminate />
            <h1 v-else class="display-2">{{recovered|thousandSeparator}}</h1>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="single-stat">
          <v-card class="card-icon" color="orange darken-1">
            <v-icon large color="white">mdi-account-multiple</v-icon>
          </v-card>
          <div class="total-label">
            {{titles[type].active}}
          </div>
          <div class="total">
            <v-progress-circular v-if="loading" class="mb-4" color="grey" indeterminate />
            <h1 v-else class="display-2">{{active|thousandSeparator}}</h1>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Formatters from '@/mixins/Formatters'
export default {
  data () {
    return {
      titles: {
        cummulative: {
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
    confirmed: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    recovered: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    type: { type: String, default: 'cummulative' },
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
