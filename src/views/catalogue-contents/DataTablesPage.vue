<template>
  <v-container fluid>
    <v-row class="px-2">
      <v-col cols="12">
        <div class="d-flex mb-2">
          <p class="title mb-0">Data Table
            <v-chip label x-small color="primary" text-color="white">
              standard
            </v-chip>
          </p>
          <v-spacer />
          <fab-small @click="datatable1_show_code=true" />
          <fab-small @click="datatable1_show_settings=true" icon="mdi-cog-outline" class="ml-1" />
        </div>
        <DataTableBasic
          :data="countries_advanced"
          :loading="countries_advanced_loading"
          :title="datatable1_settings.title"
        />
      </v-col>
      <v-col cols="12">
        <div class="d-flex mb-2">
          <p class="title mb-0">Data Table
            <v-chip label x-small color="amber darken-4" text-color="white">
              agency
            </v-chip>
          </p>
          <v-spacer />
          <fab-small @click="datatable2_show_code=true" />
          <fab-small @click="datatable2_show_settings=true" icon="mdi-cog-outline" class="ml-1" />
        </div>
        <DataTableAdvanced
          :data="countries_advanced"
          :type="datatable2_settings.data_type"
          :loading="countries_advanced_loading"
          :title="datatable2_settings.title"
        />
      </v-col>
    </v-row>
    <!-- Data Table Basic Settings Dialog -->
    <v-dialog v-model="datatable1_show_settings" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Data Table Basic Settings</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="datatable1_show_settings=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row no-gutters>
            <v-col cols="12">
              <p class="mb-1">Title</p>
              <v-text-field dense outlined hide-details
                v-model="datatable1_settings.title"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100"
          @click="datatable1_show_settings=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Data Table Basic Embed Dialog -->
    <EmbedCodeDialog :value="datatable1_code" :show.sync="datatable1_show_code" title="Data Table Basic">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="datatable1_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="datatable1_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="datatable1_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="datatable1_settings.width_unit" :items="['px', '%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined width="100" @click="previewCode(datatable1_code)">Preview</v-btn>
        <v-btn text outlined width="100" @click="datatable1_show_code=false">close</v-btn>
      </template>
    </EmbedCodeDialog>

    <!-- Data Table Advanced Settings Dialog -->
    <v-dialog v-model="datatable2_show_settings" overlay-color="rgba(255,255,255,0)" max-width="600" persistent>
      <v-card>
        <v-toolbar dense dark elevation="0" color="grey darken-3">
          <v-toolbar-title>Data Table Standard Settings</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="datatable2_show_settings=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-4 pb-1">
          <v-row no-gutters>
            <v-col cols="12">
              <p class="mb-1">Title</p>
              <v-text-field dense outlined hide-details
                v-model="datatable2_settings.title"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined width="100"
          @click="datatable2_show_settings=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Data Table Advanced Embed Dialog -->
    <EmbedCodeDialog :value="datatable2_code" :show.sync="datatable2_show_code" title="Data Table Basic">
      <template v-slot:bottom>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Width:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="datatable2_settings.width_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Max" value="max"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="datatable2_settings.width_type=='max'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="datatable2_settings.max_width"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="datatable2_settings.width_unit" :items="['px', '%']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
        <div class="d-flex align-center mt-4">
          <div class="mr-2 mt-1">Height:</div>
          <div style="min-width:200px">
            <v-radio-group hide-details row v-model="datatable2_settings.height_type"
              class="mt-0 d-inline-block"
            >
              <v-radio label="Auto" value="auto"></v-radio>
              <v-radio label="Fixed" value="fixed"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex" v-if="datatable2_settings.height_type=='fixed'">
            <div style="flex-basis:100px!important">
              <v-text-field dense outlined flat hide-details
                v-model="datatable2_settings.height"
                type="number" min="600" class="mr-1"
              />
            </div>
            <div style="flex-basis:50px!important">
              <v-select outlined dense hide-details
                v-model="datatable2_settings.height_unit" :items="['px']"
              ></v-select>
            </div>
            <div></div>
          </div>
        </div>
      </template>
      <template v-slot:actions>
        <v-spacer />
        <v-btn text outlined width="100" @click="previewCode(datatable2_code)">Preview</v-btn>
        <v-btn text outlined width="100" @click="datatable2_show_code=false">close</v-btn>
      </template>
    </EmbedCodeDialog>
  </v-container>
</template>

<script>
import qs from 'query-string'
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import EmbedCode from '@/mixins/EmbedCode'

import DataTableBasic from '@/components/DataTableBasic'
import DataTableAdvanced from '@/components/DataTableAdvanced'
import EmbedCodeDialog from '@/components/EmbedCodeDialog'
import FabSmall from '@/components/fragments/FabSmall'
export default {
  components: { DataTableAdvanced, DataTableBasic, EmbedCodeDialog, FabSmall },
  computed: {
    datatable1_code () {
      const settings = this.datatable1_settings
      const {data_type, title, width_type, width_unit, max_width} = settings
      let width = 'auto'
      if (width_type == 'max') {
        settings.max_width = isNaN(max_width) ? 1200 : max_width
        width = settings.max_width + width_unit
      }
      const query = qs.stringify({ 'data-type': data_type, title })
      const path = `data-table-1?${query}`
      return this.getEmbedText(path, width)
    },
    datatable2_code () {
      const settings = this.datatable2_settings
      const {
        data_type, title, width_type, width_unit, max_width,
        height_type, height_unit, height
      } = settings
      let width = 'auto'
      if (width_type == 'max') {
        settings.max_width = isNaN(max_width) ? 1200 : max_width
        width = settings.max_width + width_unit
      }
      let height2 = 'auto'
      if (height_type == 'fixed') {
        settings.height = isNaN(height) ? 695 : height
        height2 = settings.height
      }
      const query = qs.stringify({ 'data-type': data_type, title, height: height2 })
      const path = `data-table-2?${query}`
      return this.getEmbedText(path, width)
    }
  },
  data () {
    return {
      datatable1_show_code: false,
      datatable1_show_settings: false,
      datatable1_settings: {
        title: 'Summary Per Country',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto'
      },
      datatable2_show_code: false,
      datatable2_show_settings: false,
      datatable2_settings: {
        title: 'Summary Per Country',
        data_type: 'count',
        height_type: 'auto',
        height_unit: 'px',
        height: 'auto',
        width_type: 'auto',
        width_unit: 'px',
        max_width: 'auto'
      },
    }
  },
  mixins: [ ApiFetchers, QueryString, EmbedCode ],
  mounted () {
    this.fetchCountriesStats('advanced')
  }
}
</script>