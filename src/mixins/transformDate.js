export default {
  data () {
    return {
      date: ''
    }
  },
  methods: {
    formatToUsDate (date_str) {
      if (!date_str) return null
      const [year, month, day] = date_str.split('-')
      return `${month}/${day}/${year}`
    },
    formatToStdDate (date_str) {
      if (!date_str) return null
      const [month, day, year] = date_str.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    formatToStdDate (date_str) {
      if (!date_str) return null
      const [month, day, year] = date_str.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}