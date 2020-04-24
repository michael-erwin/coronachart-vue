<template>
  <v-app ref="app" v-if="render" v-resize="resize">
    <DataTableBasic
      :data="countries_count"
      :loading="countries_count_loading"
      :forbidden="countries_count_forbidden"
    />
  </v-app>
</template>

<script>
import DataTableBasic from '@/components/DataTableBasic'
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import FrameResize from '@/mixins/FrameResize'
export default {
  components: { DataTableBasic },
  computed: {
    title () {
      return this.query.title || `Data Table Basic`
    },
  },
  computed: {},
  created () {
    if (this.isInsideFrame) this.render = true
    // this.render = true
  },
  data () {
    return {
      render: false,
    }
  },
  mixins: [ QueryString, FrameResize, ApiFetchers ],
  mounted () {
    const wrap1 = document.querySelector('.v-application')
    const wrap2 = document.querySelector('.v-application--wrap')
    if (wrap1 && wrap2) {
      wrap1.setAttribute('style', 'background-color: transparent !important')
      wrap2.setAttribute('style', 'background-color: transparent !important; min-height:auto!important')
      this.fetchCountriesStats('count')
    }
  },
  watch: {
    countries_count () {
      this.$nextTick(this.resize)
    }
  }
}
</script>
