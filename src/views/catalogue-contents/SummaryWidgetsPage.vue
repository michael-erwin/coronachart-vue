<template>
  <v-container fluid>
    <!-- Widget 1 -->
    <v-row>
      <v-col>
        <div class="d-flex px-2">
          <p class="title mb-0">Summary Widget - {{widget1_country}}
            <v-chip label x-small color="green accent-4" text-color="white">
              free
            </v-chip>
          </p>
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
    <!-- Widget 2 -->
    <v-row>
      <v-col>
        <div class="d-flex px-2">
          <p class="title mb-0">Summary Widget - {{widget2_country}}
            <v-chip label x-small color="primary" text-color="white">
              standard
            </v-chip>
          </p>
          <v-spacer />
          <fab-small title="Get embed code" @click="widget2_code_show=true" />
          <fab-small title="Configure Widget" @click="widget2_settings_show=true"
            icon="mdi-cog-outline" class="ml-1"
          />
        </div>
        <total-widget1
          :loading="world_summary_loading||widget2_loading"
          :data="widget2_data"
          :timespan="widget2_settings.timespan"
        />
      </v-col>
    </v-row>
    <!-- Widget 1 - Settings Dialog -->
    <v-dialog v-model="widget1_settings_show" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Settings - Summary Widget</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="widget1_settings_show=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row>
            <v-col cols="12" sm="6">
              <p class="mb-1">Geographic Coverage</p>
              <v-autocomplete
                v-model="widget1_settings.country_code"
                :disabled="country_loading"
                :loading="country_loading"
                :items="country_list"
                item-text="country_name"
                item-value="country_code"
                :filter="countryFilter"
                cache-items outlined
                flat dense solo
                hide-no-data hide-details
                label="Select your country"
                @change="widget1ChangeCountry"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <p class="mb-1">Time Coverage</p>
              <v-radio-group class="mt-0" v-model="widget1_settings.timespan" hide-details row>
                <v-radio label="Cumulative" value="cumulative"></v-radio>
                <v-radio label="New Cases" value="new" disabled></v-radio>
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
    <!-- Widget 1 - Embed Dialog -->
    <embed-code-dialog :show.sync="widget1_code_show" title="Embed Code - Summary Widget" :value="widget1_code">
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
  
    <!-- Widget 2 - Settings Dialog -->
    <v-dialog v-model="widget2_settings_show" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Settings - Summary Widget</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="widget2_settings_show=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row>
            <v-col cols="12" sm="6">
              <p class="mb-1">Geographic Coverage</p>
              <v-autocomplete
                v-model="widget2_settings.country_code"
                :disabled="widget2_settings.country_loading"
                :loading="widget2_settings.country_loading"
                :items="country_list"
                item-text="country_name"
                item-value="country_code"
                :filter="countryFilter"
                cache-items outlined
                flat dense solo
                hide-no-data hide-details
                label="Select your country"
                @change="widget2ChangeCountry"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <p class="mb-1">Time Coverage</p>
              <v-radio-group class="mt-0" v-model="widget2_settings.timespan" hide-details row>
                <v-radio label="Cumulative" value="cumulative"></v-radio>
                <v-radio label="New Cases" value="new"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100"
          @click="widget2_settings_show=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Widget 2 - Embed Dialog -->
    <embed-code-dialog :show.sync="widget2_code_show" title="Embed Code - Summary Widget" :value="widget2_code">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="widget2_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="widget2_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="widget2_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="widget2_settings.width_unit" :items="['px','%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined @click="previewCode(widget2_code)" width="100">preview</v-btn>
        <v-btn text outlined @click="widget2_code_show=false" width="100">close</v-btn>
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
      const country_code = settings.country_code
      const {timespan, width_type, max_width} = settings
      let width = 'auto'
      if (width_type == 'max') {
        settings.max_width = 1200
        width = settings.max_width + settings.width_unit
      }
      const path = `summary-widget-1?country_code=${country_code}`
      return this.getEmbedText(path, width)
    },
    widget1_data () {
      return this.widget1_settings.country_code === 'W1' ? this.world_summary : this.country_summary
    },
    widget1_loading () {
      return this.world_summary_loading || this.country_summary_loading
    },
    widget1_country () {
      if (this.widget1_settings.country_code === 'W1') return 'World'
      let name = 'Unknown'
      try {
        name = this.country_summary.country_name
      } catch (e) {}
      return name
    },
    widget2_code () {
      const settings = this.widget2_settings
      const country_code = settings.country_code
      const {timespan, width_type, max_width} = settings
      let width = 'auto'
      if (width_type == 'max') {
        settings.max_width = 1200
        width = settings.max_width + settings.width_unit
      }
      const path = `summary-widget-2?country_code=${country_code}&timespan=${timespan}`
      return this.getEmbedText(path, width)
    },
    widget2_data () {
      return this.widget2_settings.country_code === 'W1' ? this.world_summary : this.widget2_settings.country_summary
    },
    widget2_loading () {
      return this.world_summary_loading || this.widget2_settings.loading
    },
    widget2_country () {
      if (this.widget2_settings.country_code === 'W1') return 'World'
      let name = 'Unknown'
      try {
        name = this.widget2_settings.country_summary.country_name //TODO: Check if correct.
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
      country_list: [{ country_code: 'W1', country_name: 'All (World Total)'}],
      widget1_code_show: false,
      widget1_settings_show: false,
      widget1_settings: {
        country_code: 'W1',
        country_search: '',
        timespan: 'cumulative',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto'
      },
      widget2_code_show: false,
      widget2_settings_show: false,
      widget2_settings: {
        country_code: 'W1',
        country_search: '',
        country_summary: {},
        loading: false,
        timespan: 'cumulative',
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
      this.$axios.get(`/v1.0/covid-stats/affected-countries`, { params })
      .then(({data}) => {
        let list = [...this.country_list, ...data]
        this.country_list = list
      })
      .catch((e) => { console.error(e) })
      .finally(() => this.country_loading = false)
    },
    widget1ChangeCountry(country_code) {
      if (this.country_code !== 'W1') this.fetchCountryStats(country_code);
    },
    widget2ChangeCountry(country_code) {
      if (this.country_code !== 'W1') this.widget2CountryFetch(country_code);
    },
    widget2CountryFetch (country_code='us', type='advanced') {
      this.widget2_settings.loading = true
      const params = { type, origin: this.origin, level: this.level }
      this.$axios.get(`/v1.0/covid-stats/countries/${country_code}`, { params })
      .then((r) => {
        if (r) this.widget2_settings.country_summary = r.data
      })
      .catch((e) => { console.error(e) })
      .finally(() => {
        this.widget2_settings.loading = false
      })
    },
  },
  mounted () {
    this.fetchWorldStats('advanced')
    this.fetchAffectedCountries()
  }
}
</script>
