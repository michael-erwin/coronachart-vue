import qs from 'query-string'
export default {
  data () {
    return {
      qurey: {},
    }
  },
  created () {
    this.query = qs.parse(location.search)
  }
}