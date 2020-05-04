<template>
  <v-container fluid>
    <v-row class="px-2">
      <v-col cols="12" lg="6">
        <div class="d-flex mb-2">
          <p class="title mb-0">Bar Chart
            <v-chip label x-small color="primary" text-color="white">
              standard
            </v-chip>
          </p>
          <v-spacer />
          <fab-small @click="barchart1_show_code=true" />
          <fab-small @click="barchart1_show_settings=true" icon="mdi-cog-outline" class="ml-1" />
        </div>
        <div>
          <TotalBarChart1 
            :data="barchart1_data" 
            :type="barchart1_settings.data_type" 
            :loading="barchart1_loading" 
            :title="barchart1_settings.title"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="6">
        <div class="d-flex mb-2">
          <p class="title mb-0">Pie Chart
            <v-chip label x-small color="primary" text-color="white">
              standard
            </v-chip>
          </p>
          <v-spacer />
          <fab-small @click="piechart1_show_code=true" />
          <fab-small @click="piechart1_show_settings=true" icon="mdi-cog-outline" class="ml-1" />
        </div>
        <div>
          <TotalPieChart1
            :data="piechart1_data" 
            :type="piechart1_settings.data_type" 
            :loading="piechart1_loading" 
            :title="piechart1_settings.title"
          />
        </div>
      </v-col>
    </v-row>
    <v-row class="px-2">
      <v-col cols="12" lg="6">
        <div class="d-flex mb-2">
          <p class="title mb-0">Switching Bar-Pie Chart
            <v-chip label x-small color="amber darken-4" text-color="white">
              agency
            </v-chip>
          </p>
          <v-spacer />
          <fab-small @click="mixchart1_show_code=true" />
          <fab-small @click="mixchart1_show_settings=true" icon="mdi-cog-outline" class="ml-1" />
        </div>
        <div>
          <TotalMixChart1
            :data="mixchart1_data"
            :type="mixchart1_settings.data_type" 
            :loading="mixchart1_loading" 
            :title="mixchart1_settings.title" 
          />
        </div>
      </v-col>
    </v-row>

    <!-- Bar Chart Settings Dialog -->
    <v-dialog v-model="barchart1_show_settings" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Settings - Bar Chart</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="barchart1_show_settings=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <p class="mb-1">Title</p>
              <v-text-field dense outlined hide-details class="mr-4"
                v-model="barchart1_settings.title"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <p class="mb-1">Data Type</p>
              <v-radio-group class="mt-0" v-model="barchart1_settings.data_type" hide-details row>
                <v-radio label="Total Case" value="count"></v-radio>
                <v-radio label="Per Million" value="density"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100"
          @click="barchart1_show_settings=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Bar Chart Embed Dialog -->
    <EmbedCodeDialog :value="barchart1_code" title="Embed Code - Bar Chart" :show.sync="barchart1_show_code">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="barchart1_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="barchart1_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="barchart1_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="barchart1_settings.width_unit" :items="['px', '%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined width="100" @click="previewCode(barchart1_code)">Preview</v-btn>
        <v-btn text outlined width="100" @click="barchart1_show_code=false">close</v-btn>
      </template>
    </EmbedCodeDialog>

    <!-- Pie Chart Settings Dialog -->
    <v-dialog v-model="piechart1_show_settings" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Settings - Pie Chart</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="piechart1_show_settings=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <p class="mb-1">Title</p>
              <v-text-field dense outlined hide-details class="mr-4"
                v-model="piechart1_settings.title"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <p class="mb-1">Data Type</p>
              <v-radio-group class="mt-0" v-model="piechart1_settings.data_type" hide-details row>
                <v-radio label="Total Case" value="count"></v-radio>
                <v-radio label="Per Million" value="density"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100"
          @click="piechart1_show_settings=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Pie Chart Embed Dialog -->
    <EmbedCodeDialog :value="piechart1_code" title="Embed Code - Pie Chart" :show.sync="piechart1_show_code">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="piechart1_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="piechart1_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="piechart1_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="piechart1_settings.width_unit" :items="['px', '%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined width="100" @click="previewCode(piechart1_code)">Preview</v-btn>
        <v-btn text outlined width="100" @click="piechart1_show_code=false">close</v-btn>
      </template>
    </EmbedCodeDialog>

    <!-- Switching Bar-Pie Settings Dialog -->
    <v-dialog v-model="mixchart1_show_settings" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Settings - Switching Bar-Pie</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="mixchart1_show_settings=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <p class="mb-1">Title</p>
              <v-text-field dense outlined hide-details class="mr-4"
                v-model="mixchart1_settings.title"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <p class="mb-1">Data Type</p>
              <v-radio-group class="mt-0" v-model="mixchart1_settings.data_type" hide-details row>
                <v-radio label="Total Case" value="count"></v-radio>
                <v-radio label="Per Million" value="density"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100"
          @click="mixchart1_show_settings=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Switching Bar-Pie Chart Embed Dialog -->
    <EmbedCodeDialog :value="mixchart1_code" :show.sync="mixchart1_show_code" title="Embed Code - Switching Bar-Pie">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="mixchart1_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="mixchart1_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="mixchart1_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="mixchart1_settings.width_unit" :items="['px', '%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined width="100" @click="previewCode(mixchart1_code)">Preview</v-btn>
        <v-btn text outlined width="100" @click="mixchart1_show_code=false">close</v-btn>
      </template>
    </EmbedCodeDialog>
  </v-container>
</template>

<script>
import qs from 'query-string'

import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import EmbedCode from '@/mixins/EmbedCode'

import TotalMixChart1 from '@/components/TotalMixChart1'
import TotalBarChart1 from '@/components/TotalBarChart1'
import TotalPieChart1 from '@/components/TotalPieChart1'
import EmbedCodeDialog from '@/components/EmbedCodeDialog'
import FabSmall from '@/components/fragments/FabSmall'
export default {
  components: { FabSmall, EmbedCodeDialog, TotalBarChart1, TotalPieChart1, TotalMixChart1 },
  computed: {
    barchart1_code () {
      const settings = this.barchart1_settings
      const {data_type, title, width_type, width_unit, max_width} = settings
      let width = 'auto'
      if (width_type == 'max') {
        settings.max_width = isNaN(max_width) ? 1200 : max_width
        width = settings.max_width + width_unit
      }
      const query = qs.stringify({ 'data-type': data_type, title })
      const path = `summary-chart-1?${query}`
      return this.getEmbedText(path, width)
    },
    barchart1_data () {
      const data_type = this.barchart1_settings.data_type
      const data_key = `countries_${data_type}`
      return this[data_key]
    },
    barchart1_loading () {
      const data_type = this.barchart1_settings.data_type
      const loading_key = `countries_${data_type}_loading`
      return this[loading_key]
    },
    piechart1_code () {
      const settings = this.piechart1_settings
      const {data_type, title, width_type, width_unit, max_width} = settings
      let width = 'auto'
      if (width_type == 'max') {
        settings.max_width = isNaN(max_width) ? 1200 : max_width
        width = settings.max_width + width_unit
      }
      const query = qs.stringify({ 'data-type': data_type, title })
      const path = `summary-chart-2?${query}`
      return this.getEmbedText(path, width)
    },
    piechart1_data () {
      const data_type = this.piechart1_settings.data_type
      const data_key = `countries_${data_type}`
      return this[data_key]
    },
    piechart1_loading () {
      const data_type = this.piechart1_settings.data_type
      const loading_key = `countries_${data_type}_loading`
      return this[loading_key]
    },
    mixchart1_data () {
      const data_type = this.mixchart1_settings.data_type
      const data_key = `countries_${data_type}`
      return this[data_key]
    },
    mixchart1_code () {
      const settings = this.mixchart1_settings
      const {data_type, title, width_type, width_unit, max_width} = settings
      let width = 'auto'
      if (width_type == 'max') {
        settings.max_width = isNaN(max_width) ? 1200 : max_width
        width = settings.max_width + width_unit
      }
      const query = qs.stringify({ 'data-type': data_type, title })
      const path = `summary-chart-3?${query}`
      return this.getEmbedText(path, width)
    },
    mixchart1_loading () {
      const data_type = this.mixchart1_settings.data_type
      const loading_key = `countries_${data_type}_loading`
      return this[loading_key]
    }
  },
  data () {
    return {
      barchart1_show_code: false,
      barchart1_show_settings: false,
      barchart1_settings: {
        data_type: 'count',
        title: 'My Bar Chart',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto'
      },
      piechart1_show_code: false,
      piechart1_show_settings: false,
      piechart1_settings: {
        data_type: 'count',
        title: 'My Pie Chart',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto'
      },
      mixchart1_show_code: false,
      mixchart1_show_settings: false,
      mixchart1_settings: {
        data_type: 'count',
        title: 'My Combo Chart',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto'
      }
    }
  },
  mixins: [ EmbedCode, QueryString, ApiFetchers ],
  mounted () {
    this.fetchCountriesStats('count')
    this.fetchCountriesStats('density')
  }
}
</script>
