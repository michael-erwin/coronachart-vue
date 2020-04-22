<template>
  <v-container fluid>
    <!-- Widget 1 -->
    <v-row>
      <v-col>
        <div class="d-flex px-2">
          <p class="title mb-0">Summary Widget 1 - {{widget1_country}}</p>
          <v-spacer />
          <fab-small title="Get embed code" @click="widget1_code_show=true" />
          <fab-small title="Configure Widget" @click="widget1_settings_show=true"
            icon="mdi-cog-outline" class="ml-1"
          />
        </div>
        <total-widget1
          :loading="world_summary_loading||country_summary_loading"
          :data="widget1_data"
          :timespan="widget1_settings.timespan"
        />
      </v-col>
    </v-row>
    <!-- Settings Dialog -->
    <v-dialog v-model="widget1_settings_show" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Summary Widget 1 Settings</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="widget1_settings_show=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <p class="mb-1">Geographic Coverage</p>
              <v-radio-group class="mt-0 mb-3" v-model="widget1_settings.geo" hide-details row
                @change="widget1ChangeCountry(widget1_settings.country_code)"
              >
                <v-radio label="World Total" value="world"></v-radio>
                <v-radio label="Country Total" value="country"></v-radio>
              </v-radio-group>
              <v-autocomplete v-show="widget1_settings.geo=='country'"
                v-model="widget1_settings.country_code"
                :disabled="country_loading"
                :loading="country_loading"
                :items="country_list"
                item-text="country_name"
                item-value="country_code"
                :filter="countryFilter"
                cache-items
                class="mr-2"
                flat
                dense
                hide-no-data
                hide-details
                solo
                outlined
                label="Select your country"
                @change="widget1ChangeCountry"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <p class="mb-1">Time Coverage</p>
              <v-radio-group class="mt-0" v-model="widget1_settings.timespan" hide-details row>
                <v-radio label="Cummulative" value="cummulative"></v-radio>
                <v-radio label="New Cases" value="new"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100"
          @click="widget1_settings_show=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Embed Dialog -->
    <embed-code-dialog :show.sync="widget1_code_show" :value="widget1_code">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="widget1_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="widget1_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="widget1_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="widget1_settings.width_unit" :items="['px','%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined @click="previewCode(widget1_code)" width="100">preview</v-btn>
        <v-btn text outlined @click="widget1_code_show=false" width="100">close</v-btn>
      </template>
    </embed-code-dialog>
  </v-container>
</template>

<script>
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import EmbedCode from '@/mixins/EmbedCode'

import TotalWidget1 from '@/components/TotalWidget1'
import EmbedCodeDialog from '@/components/EmbedCodeDialog'
import FabSmall from '@/components/fragments/FabSmall'
export default {
  components: { EmbedCodeDialog, FabSmall, TotalWidget1 },
  computed: {
    widget1_code () {
      const settings = this.widget1_settings
      const country_code = settings.geo == 'country' ? settings.country_code : 'all'
      const {timespan, width_type, max_width} = settings
      let width = 'auto'
      if (width_type == 'max') {
        settings.max_width = 1200
        width = settings.max_width + settings.width_unit
      }
      const path = `summary-widget-1?country_code=${country_code}&timespan=${timespan}`
      return this.getEmbedText(path, width)
    },
    widget1_data () {
      return this.widget1_settings.geo == 'world' ? this.world_summary : this.country_summary
    },
    widget1_loading () {
      return this.world_summary_loading || this.country_summary_loading
    },
    widget1_country () {
      if (this.widget1_settings.geo == 'world') return 'World'
      let name = 'Unknown'
      try {
        name = this.country_summary.country_name
      } catch (e) {}
      return name
    },
  },
  created () {
    this.level = 0
  },
  data () {
    return {
      country_loading: false,
      country_list: [],
      widget1_code_show: false,
      widget1_settings_show: false,
      widget1_settings: {
        geo: 'world',
        country_code: 'US',
        country_search: '',
        timespan: 'cummulative',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto'
      }
    }
  },
  mixins: [ EmbedCode, QueryString, ApiFetchers ],
  methods: {
    countryFilter (item, queryText, itemText) {
      const text1 = item.country_code.toLowerCase()
      const text2 = item.country_name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return text1.indexOf(searchText) > -1 || text2.indexOf(searchText) > -1
    },
    fetchAffectedCountries () {
      this.country_loading = true
      const params = { origin: this.origin, level: this.level }
      this.$axios.get(`/v2/covid-stats/affected-countries`, { params })
      .then((response) => {
        this.country_list = response.data
      })
      .catch((e) => { console.error(e) })
      .finally(() => this.country_loading = false)
    },
    widget1ChangeCountry(country_code) {
      if (country_code && country_code.length === 2) this.fetchCountryStats(country_code)
    }
  },
  mounted () {
    this.fetchWorldStats('advanced')
    this.fetchAffectedCountries()
  }
}
</script>
