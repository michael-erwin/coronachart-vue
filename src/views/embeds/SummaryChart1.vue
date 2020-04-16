<template>
  <v-app ref="app" v-if="render" v-resize="resize">
    <TotalBarChart1 :data="countries_data" :title="title" :type="data_type" :loading="loading" />
  </v-app>
</template>

<script>
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import TotalBarChart1 from '@/components/TotalBarChart1'
export default {
  components: { TotalBarChart1 },
  computed: {
    isInsideFrame () {
      return window.self !== window.top
    },
    countries_data () {
      return this.data_type == 'count' ? this.countries_count : this.countries_density
    },
    loading () {
      return this.countries_count_loading || this.countries_density_loading
    },
    title () {
      return this.query.title || `Summary (${this.data_type})`
    }
  },
  created () {
    if (this.isInsideFrame) this.render = true
    // this.render = true
  },
  data () {
    return {
      render: false,
      data_type: 'count'
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
      const data_type = this.query['data-type']
      if (data_type && data_type == 'density') this.data_type = 'density'
      else this.data_type = 'count'
      this.$nextTick(() => { this.fetchCountriesStats(this.data_type) })
    }
  },
}
</script>
