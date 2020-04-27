<template>
  <v-card class="embed-data-table" style="position:relative">
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
    <v-data-table
      :headers="headers"
      :items.sync="items"
      :search="search"
      :loading="loading"
      :footer-props="footer_props"
      :height="computedHeight"
      sort-by="confirmed"
      :sort-desc="true"
    >
      <template v-slot:body="{items}">
        <tbody>
          <tr v-for="item in items" :key="item.country_code">
            <td><img class="flag-icon" :src="getFlagLink(item.country_code)"> {{item.country_name}}</td>
            <td>{{item.confirmed|thousandSeparator}}</td>
            <td>{{item.deaths|thousandSeparator}}</td>
            <td>{{item.recovered|thousandSeparator}}</td>
            <td>{{item.active|thousandSeparator}}</td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <ErrorOverlay :show="forbidden" />
  </v-card>
</template>

<script>
import Formatters from '@/mixins/Formatters'
import ErrorOverlay from '@/components/fragments/ErrorOverlay'
export default {
  components: { ErrorOverlay },
  computed: {
    computedHeight () {
      let height = 'auto'
      const input_height = parseInt(this.height)
      if (Number.isInteger(input_height)) {
        height = (input_height > 199) ? (input_height - 112) : 200
      }
      return height
    }
  },
  data () {
    return {
      headers: [
        { text: 'Country', value: 'country_name', sortable: true },
        { text: 'Confirmed', value: 'confirmed', sortable: true },
        { text: 'Deaths', value: 'deaths', sortable: true },
        { text: 'Recovered', value: 'recovered', sortable: true },
        { text: 'Active', value: 'active', sortable: true },
        // { text: 'Population', value: 'population' },
        // { text: 'Actions', value: 'action', sortable: false },
      ],
      footer_props: {
        'items-per-page-options': [],
        'items-per-page-text': null,
        'disable-items-per-page': true 
      },
      items: [],
      search: '',
    }
  },
  methods: {
    getFlagLink(country_code) {
      return `https://www.countryflags.io/${country_code}/flat/24.png`
    },
    structureData (data) {
      const { date, type, items } = data
      for (const item of items) {
        const {country_name, country_code} = item
        const active = item['total_active']
        const confirmed = item['total_confirmed']
        const deaths = item['total_deaths']
        const recovered = item['total_recovered']
        this.items.push({ country_name, country_code, active, confirmed, deaths, recovered, })
      }
    }
  },
  mixins: [ Formatters ],
  props: {
    data: Object,
    forbidden: { type: Boolean, default: false },
    height: { type: Number|String, default: 'auto' },
    loading: { type: Boolean, default: false },
    title: { type: String, default: 'Data Table - Basic'},
  },
  watch: {
    data(items) {
      this.structureData(items)
    }
  }
}
</script>