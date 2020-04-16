<template>
  <v-app ref="app" v-if="render" v-resize="resize">
    <total-widget1
      :loading="world_summary_loading||country_summary_loading"
      :data="summary_data"
      :timespan="timespan"
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
    },
    summary_data () {
      return this.country_code == 'all' ? this.world_summary : this.country_summary
    },
  },
  created () {
    if (this.isInsideFrame) this.render = true
    // this.render = true
  },
  data () {
    return {
      query: {},
      render: false,
      country_code: 'all',
      timespan: 'cummulative'
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
      const { timespan, country_code } = this.query
      if (timespan && timespan == 'new') this.timespan = 'new'
      else this.timespan = 'cummulative'
      if (country_code && country_code.length == 2) {
        this.country_code = country_code
        this.fetchCountryStats(country_code)
      } else {
        this.country_code = 'all'
        this.fetchWorldStats()
      }
    }
  },
}
</script>
