export default {
  data () {
    return {
      domain: process.env.VUE_APP_URL,
      // v2/covid-stats/world
      world_summary: {},
      world_summary_loading: false,
      // v2/covid-stats/countries/${country_code}
      country_summary: {},
      country_summary_loading: false,
      // v2/covid-stats/countries/${country_code}?span=past
      country_series: {},
      country_series_loading: false,
      // v2/covid-stats/countries?type=count
      countries_count: {}, 
      countries_count_loading: false,
      // v2/covid-stats/countries?type=density
      countries_density: {}, 
      countries_density_loading: false,
    }
  },
  methods: {
    fetchCountryStats (country_code='us', type='advanced') {
      this.country_summary_loading = true
      const params = { type }
      this.$axios.get(`${this.domain}/v2/covid-stats/countries/${country_code}`, { params })
      .then((response) => {
        this.country_summary = response.data
        this.country_summary_loading = false
      })
      .catch((e) => { console.error(e) })
    },
    fetchCountriesStats (type='count') {
      const data_placeholder = `countries_${type}`
      const loading_ref = `countries_${type}_loading`
      const params = { type }
      this[loading_ref] = true
      this.$axios.get(`${this.domain}/v2/covid-stats/countries`, { params })
      .then((response) => {
        this[data_placeholder] = response.data
        this[loading_ref] = false
      })
      .catch((e) => { console.error(e) })
    },
    fetchWorldStats (type='advanced') {
      this.world_summary_loading = true
      const params = { type }
      this.$axios.get(`${this.domain}/v2/covid-stats/world`, { params })
      .then((response) => {
        this.world_summary = response.data
        this.world_summary_loading = false
      })
      .catch((e) => { console.error(e) })
    },
  }
}