export default {
  methods: {
    fetchAuth () {
      const domain = process.env.VUE_APP_URL;
      const params = { level: 'system' }
      this.$axios.get(`${domain}/v2/covid-stats/ping`, { params })
      .then((response) => {
        console.log(response)
      })
      .catch((e) => {
        console.log(e)
        // sessionStorage.access_level = 'guest'
      })
    }
  }
}