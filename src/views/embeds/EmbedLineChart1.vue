<template>
  <v-app ref="app" v-if="render" v-resize="resize">
    <LineChartBasic
      :code="code"
      :level="level"
      :origin="origin"
      :title="title"
      :daily-change="daily_change"
      :height="height"
    />
  </v-app>
</template>

<script>
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
import FrameResize from '@/mixins/FrameResize'
import LineChartBasic from '@/components/LineChartBasic'
export default {
  components: { LineChartBasic },
  computed: {
    code () {
      return this.query.code || 'W1'
    },
    daily_change () {
      return this.query['daily'] === 'true' ? true : false
    },
    height () {
      let input_height = parseInt(this.query['height'])
      return input_height > 299 ? input_height : 540
    },
    title () {
      return this.query.title || `Timeline Series`
    }
  },
  created () {
    try {
      const self = location.host === top.location.host
      if (self) this.level = 0
      else this.level = 1
    } catch (e) {
      console.log('Something went wrong')
      this.level = 1
    }
    
    if (this.isInsideFrame) this.render = true
    // this.render = true
  },
  data () {
    return {
      render: false,
      data_type: 'count'
    }
  },
  mixins: [ QueryString, FrameResize, ApiFetchers ],
  mounted () {
    // document.getElementsByTagName('html')[0].onresize = this.resize
    const wrap1 = document.querySelector('.v-application')
    const wrap2 = document.querySelector('.v-application--wrap')
    if (wrap1 && wrap2) {
      wrap1.setAttribute('style', 'background-color: transparent !important')
      wrap2.setAttribute('style', 'background-color: transparent !important; min-height:auto!important')
      this.resize()
    }
  },
}
</script>
