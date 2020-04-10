<template>
  <v-app ref="app" v-if="render" v-resize="resize">
    <total-widget1
      :loading="loading"
      :confirmed="confirmed"
      :deaths="deaths"
      :recovered="recovered"
      :active="active"
      :type="type"
    />
  </v-app>
</template>

<script>
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import TotalWidget1 from '@/components/TotalWidget1'
export default {
  components: { TotalWidget1 },
  computed: {
    isInsideFrame () {
      return window.self !== window.top
    }
  },
  created () {
    if (this.isInsideFrame) this.render = true
    // this.render = true
  },
  data () {
    return {
      query: {},
      loading: false,
      render: false,
      confirmed: 0,
      deaths: 0,
      recovered: 0,
      active: 0,
      type: 'cummulative'
    }
  },
  methods: {
    resize () {
      const v = this.$refs.app.$el.offsetHeight
      const data = { t: 'r', v }
      parent.postMessage(data, '*')
    }
  },
  mixins: [ QueryString, ApiFetchers ],
  mounted () {
    const wrap1 = document.querySelector('.v-application')
    const wrap2 = document.querySelector('.v-application--wrap')
    if (wrap1 && wrap2) {
      wrap1.setAttribute('style', 'background-color: transparent !important')
      wrap2.setAttribute('style', 'background-color: transparent !important')
      this.resize()
      const { span, country_code } = this.query
      if (span && span == '24h') this.type = 'new'
      else this.type = 'cummulative'
      if (country_code && country_code.length == 2) this.fetchCountryStats(country_code)
      else this.fetchWorldStats()
    }
  },
  watch: {
    world_stats_loading(loading) {
      this.loading = this.world_stats_loading
      if (!loading) {
        const span = this.query.span
        if (span && span == '24h') {
          this.confirmed = this.world_new_confirmed
          this.deaths = this.world_new_deaths
          this.recovered = this.world_new_recovered
          this.active = this.world_new_active
        } else {
          this.confirmed = this.world_confirmed
          this.deaths = this.world_deaths
          this.recovered = this.world_recovered
          this.active = this.world_active
        }
      }
    },
    country_stats_loading(loading) {
      this.loading = this.country_stats_loading
      if (!loading) {
        const span = this.query.span
        if (span && span == '24h') {
          this.confirmed = this.country_new_confirmed
          this.deaths = this.country_new_deaths
          this.recovered = this.country_new_recovered
          this.active = this.country_new_active
        } else {
          this.confirmed = this.country_confirmed
          this.deaths = this.country_deaths
          this.recovered = this.country_recovered
          this.active = this.country_active
        }
      }
    }
  }
}
</script>
