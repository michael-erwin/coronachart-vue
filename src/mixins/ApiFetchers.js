export default {
  computed: {
    isInsideFrame () {
      return window.self !== window.top
    },
    origin () {
      const re_domain = /^(?:http|https):\/\/([a-z0-9\.\-]+)(?:\/.*)?/
      if (window.self !== window.top) {
        try {
          return document.referrer.match(re_domain)[1]
        } catch(e){ return 'self' }
      } else {
        return 'self'
      }
    }
  },
  data () {
    return {
      level: 0,
      domain: process.env.VUE_APP_URL,
      // v2/covid-stats/world
      world_summary: {},
      world_summary_loading: false,
      world_summary_forbidden: false,
      // v2/covid-stats/countries/${country_code}
      country_summary: {},
      country_summary_loading: false,
      country_summary_forbidden: false,
      // v2/covid-stats/countries/${country_code}?span=past
      country_series: {},
      country_series_loading: false,
      country_series_forbidden: false,
      // v2/covid-stats/countries?type=count
      countries_count: {}, 
      countries_count_loading: false,
      countries_count_forbidden: false,

      // v2/covid-stats/countries?type=density
      countries_density: {}, 
      countries_density_loading: false,
      countries_density_forbidden: false,

      // v2/covid-stats/countries?type=advanced
      countries_advanced: {}, 
      countries_advanced_loading: false,
      countries_advanced_forbidden: false,
    }
  },
  methods: {
    fetchCountryStats (country_code='us', type='advanced') {
      this.country_summary_loading = true
      const params = { type, origin: this.origin, level: this.level }
      this.$axios.get(`/v2/covid-stats/countries/${country_code}`, { params })
      .then((r) => {
        if (r) this.country_summary = r.data
      })
      .catch((e) => {
        if (e.response) {
          const { status, headers, data} = e.response
          if (status === 401) this.country_summary_forbidden = true
        }
      })
      .finally(() => {
        this.country_summary_loading = false
      })
    },
    fetchCountriesStats (type='count') {
      const data_placeholder = `countries_${type}`
      const loading_ref = `countries_${type}_loading`
      const params = { type, origin: this.origin, level: this.level }
      let output = false
      this[loading_ref] = true
      this.$axios.get(`/v2/covid-stats/countries`, { params })
      .then((r) => {
        if (r) {
          this[data_placeholder] = r.data
          output = r.data
        }
      })
      .catch((e) => {
        if (e.response) {
          const { status, headers, data} = e.response
          if (status === 401) this[`${data_placeholder}_forbidden`] = true
        }
      })
      .finally(() => {
        this[loading_ref] = false
        return output
      })
    },
    fetchWorldStats (type='advanced') {
      this.world_summary_loading = true
      let output = false
      const params = { type, origin: this.origin, level: this.level }
      this.$axios.get(`/v2/covid-stats/world`, { params })
      .then((r) => {
        if (r) {
          this.world_summary = r.data
          output = r.data
        }
      })
      .catch((e) => {
        if (e.response) {
          const { status, headers, data} = e.response
          if (status === 401) this.world_summary_forbidden = true
        }
      })
      .finally(() => {
        this.world_summary_loading = false
        return output
      })
    },
  }
}