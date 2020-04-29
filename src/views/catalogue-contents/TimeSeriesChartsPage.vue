<template>
  <v-container fluid>
    <v-row class="px-2">
      <v-col cols="12" lg="6">
        <div class="d-flex mb-2">
          <p class="title mb-0">Line Chart Basic</p>
          <v-spacer />
          <fab-small @click="linechart1_code_show=true" />
          <fab-small @click="linechart1_settings_show=true" icon="mdi-cog-outline" class="ml-1" />
        </div>
        <div>
          <LineChartBasic 
            :code="linechart1_settings.country_code" 
            :title="linechart1_settings.title"
            :daily-change="linechart1_settings.daily_change"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="6">
        <div class="d-flex mb-2">
          <p class="title mb-0">Line Chart Standard</p>
          <v-spacer />
          <fab-small @click="linechart2_code_show=true" />
          <fab-small @click="linechart2_settings_show=true" icon="mdi-cog-outline" class="ml-1" />
        </div>
        <div>
          <LineChartStandard :default-code.sync="linechart2_settings.country_code"
            :title="linechart2_settings.title"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Line Chart Basic Embed Dialog -->
    <EmbedCodeDialog :value="linechart1_code" title="Embed Code - Line Chart Basic" :show.sync="linechart1_code_show">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="linechart1_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="linechart1_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="linechart1_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="linechart1_settings.width_unit" :items="['px', '%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Height:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row value="fixed" class="mt-0 d-inline-block">
              <v-radio label="Auto" value="auto" disabled></v-radio>
              <v-radio label="Fixed" value="fixed"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="linechart1_settings.height_type=='fixed'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="linechart1_settings.height"
                type="number" min="300" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details value="px" :items="['px']"></v-select>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined width="100" @click="previewCode(linechart1_code)">Preview</v-btn>
        <v-btn text outlined width="100" @click="linechart1_code_show=false">close</v-btn>
      </template>
    </EmbedCodeDialog>
    <!-- Line Chart Basic Settings Dialog -->
    <v-dialog v-model="linechart1_settings_show" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Settings - Line Chart Basic</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="linechart1_settings_show=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row>
            <v-col cols="12" sm="6">
              <p class="mb-1">Title</p>
              <v-text-field dense outlined hide-details
                v-model="linechart1_settings.title"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <p class="mb-1">Geographic Coverage</p>
              <v-autocomplete
                v-model="linechart1_settings.country_code"
                :disabled="country_loading"
                :loading="country_loading"
                :items="country_list"
                item-text="country_name"
                item-value="country_code"
                :filter="countryFilter"
                cache-items outlined
                flat dense solo
                hide-no-data
                hide-details
                label="Select your country"
                @change="linechart1ChangeCountry"
              />
            </v-col>
            <v-col>
              <p class="mb-1">Time Coverage</p>
              <v-radio-group hide-details v-model="linechart1_settings.daily_change" row class="mt-0">
                <v-radio small label="Cummulative" :value="false" />
                <v-radio dense label="Daily Change" :value="true" :disabled="linechart1_settings.country_code=='W1'" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100"
          @click="linechart1_settings_show=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Line Chart Standard Embed Dialog -->
    <EmbedCodeDialog :value="linechart2_code" title="Embed Code - Line Chart Standard" :show.sync="linechart2_code_show">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="linechart2_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="linechart2_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="linechart2_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="linechart2_settings.width_unit" :items="['px', '%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Height:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row value="fixed" class="mt-0 d-inline-block">
              <v-radio label="Auto" value="auto" disabled></v-radio>
              <v-radio label="Fixed" value="fixed"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="linechart2_settings.height_type=='fixed'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="linechart2_settings.height"
                type="number" min="300" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details value="px" :items="['px']"></v-select>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined width="100" @click="previewCode(linechart2_code)">Preview</v-btn>
        <v-btn text outlined width="100" @click="linechart2_code_show=false">close</v-btn>
      </template>
    </EmbedCodeDialog>
    <!-- Line Chart Standard Settings Dialog -->
    <v-dialog v-model="linechart2_settings_show" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Settings - Line Chart Standard</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="linechart2_settings_show=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row>
            <v-col cols="12">
              <p class="mb-1">Title</p>
              <v-text-field dense outlined hide-details v-model="linechart2_settings.title" />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100" @click="linechart2_settings_show=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import qs from 'query-string'

import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import EmbedCode from '@/mixins/EmbedCode'

import EmbedCodeDialog from '@/components/EmbedCodeDialog'
import LineChartBasic from '@/components/LineChartBasic'
import LineChartStandard from '@/components/LineChartStandard'
import FabSmall from '@/components/fragments/FabSmall'
export default {
  components: { EmbedCodeDialog, FabSmall, LineChartBasic, LineChartStandard },
  computed: {
    linechart1_code () {
      const settings = this.linechart1_settings
      const {
        country_code, daily_change, title, width_type, width_unit, max_width,
        height_type, height
      } = settings
      let width = '800px'
      if (width_type == 'max') {
        settings.max_width = isNaN(max_width) ? 1200 : max_width
        width = settings.max_width + width_unit
      }
      let height2 = 'auto'
      if (height_type == 'fixed') {
        settings.height = isNaN(height) ? 695 : height
        height2 = settings.height
      }
      const query = qs.stringify({
        code: country_code, 'daily': daily_change, title, height: height2
      })
      const path = `line-chart-1?${query}`
      return this.getEmbedText(path, width)
    },
    linechart2_code () {
      const settings = this.linechart2_settings
      const {
        country_code, title, width_type, width_unit, max_width,
        height_type, height
      } = settings
      let width = '800px'
      if (width_type == 'max') {
        settings.max_width = isNaN(max_width) ? 1200 : max_width
        width = settings.max_width + width_unit
      }
      let height2 = 'auto'
      if (height_type == 'fixed') {
        settings.height = isNaN(height) ? 695 : height
        height2 = settings.height
      }
      const query = qs.stringify({ code: country_code, title, height: height2 })
      const path = `line-chart-2?${query}`
      return this.getEmbedText(path, width)
    }
  },
  data () {
    return {
      country_list: [],
      country_loading: false,
      linechart1_code_show: false,
      linechart1_settings_show: false,
      linechart1_settings: {
        daily_change: false,
        title: 'My Country Chart',
        country_code: 'W1',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto',
        height: '540',
        height_type: 'fixed',
      },
      linechart2_code_show: false,
      linechart2_settings_show: false,
      linechart2_settings: {
        title: 'My Country Chart',
        country_code: 'US',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto',
        height: '540',
        height_type: 'fixed',
      }
    }
  },
  methods: {
    countryFilter (item, queryText, itemText) {
      const text1 = item.country_code.toLowerCase()
      const text2 = item.country_name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return text1.indexOf(searchText) > -1 || text2.indexOf(searchText) > -1
    },
    fetchAffectedCountries () {
      this.country_loading = true
      const params = { origin: 'self', level: '0' }
      this.$axios.get(`/v2/covid-stats/affected-countries`, { params })
      .then(({data}) => {
        let list = [{ country_code: 'W1', country_name: 'All (World Total)'}, ...data]
        this.country_list = list
      })
      .catch((e) => { console.error(e) })
      .finally(() => this.country_loading = false)
    },
    linechart1ChangeCountry(country_code) {
      if (country_code === 'W1') this.linechart1_settings.data_type = 'cummulative'
    }
  },
  mixins: [ ApiFetchers, QueryString, EmbedCode ],
  mounted () {
    this.fetchAffectedCountries()
  }
}
</script>