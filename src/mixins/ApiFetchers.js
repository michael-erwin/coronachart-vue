export default {
  data () {
    return {
      domain: process.env.VUE_APP_URL,
      world_stats_loading: false,
      world_confirmed: 0,
      world_deaths: 0,
      world_recovered: 0,
      world_active: 0,
      world_new_confirmed: 0,
      world_new_deaths: 0,
      world_new_recovered: 0,
      world_new_active: 0,
      country_stats_loading: false,
      country_confirmed: 0,
      country_deaths: 0,
      country_recovered: 0,
      country_active: 0,
      country_new_confirmed: 0,
      country_new_deaths: 0,
      country_new_recovered: 0,
      country_new_active: 0,
    }
  },
  methods: {
    fetchCountryStats (country_code='us', type='advanced') {
      this.country_stats_loading = true
      const params = { type }
      this.$axios.get(`${this.domain}/v2/covid-stats/total/${country_code}`, { params })
      .then((response) => {
        const data = response.data
        this.country_confirmed = data.total_confirmed ? data.total_confirmed : 0
        this.country_deaths = data.total_deaths ? data.total_deaths : 0
        this.country_recovered = data.total_recovered ? data.total_recovered : 0
        this.country_active = data.total_active ? data.total_active : 0
        this.country_new_confirmed = data.new_confirmed ? data.new_confirmed : 0
        this.country_new_deaths = data.new_deaths ? data.new_deaths : 0
        this.country_new_recovered = data.new_recovered ? data.new_recovered : 0
        this.country_new_active = data.new_active ? data.new_active : 0
        this.country_stats_loading = false
      })
      .catch((e) => { console.error(e) })
    },
    fetchWorldStats (type='advanced') {
      this.world_stats_loading = true
      const params = { type }
      this.$axios.get(`${this.domain}/v2/covid-stats/total`, { params })
      .then((response) => {
        const data = response.data
        this.world_confirmed = data.total_confirmed ? data.total_confirmed : 0
        this.world_deaths = data.total_deaths ? data.total_deaths : 0
        this.world_recovered = data.total_recovered ? data.total_recovered : 0
        this.world_active = data.total_active ? data.total_active : 0
        this.world_new_confirmed = data.new_confirmed ? data.new_confirmed : 0
        this.world_new_deaths = data.new_deaths ? data.new_deaths : 0
        this.world_new_recovered = data.new_recovered ? data.new_recovered : 0
        this.world_new_active = data.new_active ? data.new_active : 0
        this.world_stats_loading = false
      })
      .catch((e) => { console.error(e) })
    },
  }
}