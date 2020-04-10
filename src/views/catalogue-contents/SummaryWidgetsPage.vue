<template>
  <v-container light>
    <!-- World Summary -->
    <v-row>
      <v-col>
        <div class="d-flex px-2">
          <p class="title mb-0">World Summary</p>
          <v-spacer />
          <v-btn fab small
            color="grey darken-2"
            class="white--text"
            elevation="1"
            title="Get embed code"
            @click="embedCode('world', 'all')"
          >
            <v-icon>mdi-code-braces</v-icon>
          </v-btn>
        </div>
        <total-widget1
          :loading="world_stats_loading"
          :confirmed="world_confirmed"
          :deaths="world_deaths"
          :recovered="world_recovered"
          :active="world_active"
        />
      </v-col>
    </v-row>
    <!-- World Summary (Change in 24hrs) -->
    <v-row>
      <v-col>
        <div class="d-flex px-2">
          <p class="title mb-0">World Summary (Change in 24hrs)</p>
          <v-spacer />
          <v-btn fab small
            color="grey darken-2"
            class="white--text"
            elevation="1"
            title="Get embed code"
            @click="embedCode('world', '24h')"
          >
            <v-icon>mdi-code-braces</v-icon>
          </v-btn>
        </div>
        <total-widget1
          :loading="world_stats_loading"
          :confirmed="world_new_confirmed"
          :deaths="world_new_deaths"
          :recovered="world_new_recovered"
          :active="world_new_active"
          type="new"
        />
      </v-col>
    </v-row>
    <!-- Country Summary -->
    <v-row>
      <v-col>
        <div class="d-flex px-2">
          <p class="title mb-0">Country Summary</p>
          <v-spacer />
          <div style="max-width:250px">
            <v-autocomplete
              v-model="country_code"
              :disabled="country_loading"
              :loading="country_loading"
              :items="country_list"
              item-text="country_name"
              item-value="country_code"
              :filter="countryFilter"
              cache-items
              flat
              dense
              hide-no-data
              hide-details
              solo
              outlined
              class="mx-2"
              label="Select your country"
              @change="reFetchCountryStats"
          />
          </div>
          <v-btn fab small
            color="grey darken-2"
            class="white--text"
            elevation="1"
            title="Get embed code"
            @click="embedCode('country', 'all')"
          >
            <v-icon>mdi-code-braces</v-icon>
          </v-btn>
        </div>
        <total-widget1
          :loading="country_stats_loading"
          :confirmed="country_confirmed"
          :deaths="country_deaths"
          :recovered="country_recovered"
          :active="country_active"
        />
      </v-col>
    </v-row>
    <!-- Country Summary (Change in 24hrs) -->
    <v-row>
      <v-col>
        <div class="d-flex px-2">
          <p class="title mb-0">Country Summary (Change in 24hrs)</p>
          <v-spacer />
          <v-btn fab small
            color="grey darken-2"
            class="white--text"
            elevation="1"
            title="Get embed code"
            @click="embedCode('country', '24h')"
          >
            <v-icon>mdi-code-braces</v-icon>
          </v-btn>
        </div>
        <total-widget1
          :loading="country_stats_loading"
          :confirmed="country_new_confirmed"
          :deaths="country_new_deaths"
          :recovered="country_new_recovered"
          :active="country_new_active"
          type="new"
        />
      </v-col>
    </v-row>
    <embed-code-dialog :show.sync="show_code" :value="code" />
  </v-container>
</template>

<script>
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import TotalWidget1 from '@/components/TotalWidget1'
import EmbedCodeDialog from '@/components/EmbedCodeDialog'
export default {
  components: { EmbedCodeDialog, TotalWidget1 },
  computed: {
    code () {
      const id = this.randomId()
      const url = window.location.origin
      const country_code = this.type == 'country' ? this.country_code : 'all'
      const query = `?country_code=${country_code}&span=${this.span}`
      return`<iframe src="${url}\/embeds\/summary-widget${query}"
  id="${id}" allowtransparency="true" frameborder="0" width="100%" 
><\/iframe>
<script>
  (function(){
    var f = document.getElementById('${id}');
    window.addEventListener('message', function(m){
      try {var d=m.data;if(d.t==='r') f.height=d.v+'px'}catch(e){}
  }, false);}())
<\/script>`;
    }
  },
  data () {
    return {
      country_code: 'US',
      country_list: [],
      country_loading: false,
      country_search: '',
      show_code: false,
      type: 'world',
      span: 'all',
    }
  },
  mixins: [ QueryString, ApiFetchers ],
  methods: {
    countryFilter (item, queryText, itemText) {
      const text1 = item.country_code.toLowerCase()
      const text2 = item.country_name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return text1.indexOf(searchText) > -1 || text2.indexOf(searchText) > -1
    },
    fetchAffectedCountries () {
      this.country_loading = true
      this.$axios.get(`${this.domain}/v2/covid-stats/affected-countries`)
      .then((response) => {
        this.country_list = response.data
        this.reFetchCountryStats()
      })
      .catch((e) => { console.error(e) })
      .finally(() => this.country_loading = false)
    },
    reFetchCountryStats() {
      this.fetchCountryStats(this.country_code, 'advanced')
    },
    randomId () {
      return 'fr_' + Math.random().toString(16).substr(2, 5)
    },
    embedCode (type='world', span='all') {
      this.type = type
      this.span = span
      this.show_code = true
    }
  },
  mounted () {
    this.fetchWorldStats('advanced')
    this.fetchAffectedCountries()
  }
}
</script>
