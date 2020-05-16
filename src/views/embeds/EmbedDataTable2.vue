<template>
  <v-app ref="app" v-if="render" v-resize="resize">
    <DataTableAdvanced
      :data="countries_advanced"
      :type="type"
      :loading="countries_advanced_loading"
      :title="title"
      :forbidden="countries_advanced_forbidden"
      :height="height"
      @resize="resize"
    />
  </v-app>
</template>

<script>
import DataTableAdvanced from '@/components/DataTableAdvanced'
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import FrameResize from '@/mixins/FrameResize'
export default {
  components: { DataTableAdvanced },
  computed: {
    title () {
      return this.query.title || `Data Table Standard`
    },
    type () {
      return this.query.type || `count`
    },
    height () {
      return this.query.height || `auto`
    },
  },
  created () {
    try {
      const self = location.host === top.location.host
      if (self) this.level = 0
      else this.level = 2
    } catch (e) {
      this.level = 2
    }
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
      this.fetchCountriesStats('advanced')
    }
  },
  watch: {
    countries_advanced () {
      this.$nextTick(this.resize)
    }
  }
}
</script>
