export default {
  methods: {
    resize () {
      const i = this.query.id
      const v = this.$refs.app.$el.clientHeight
      const data = { i , v }
      parent.postMessage(data, '*')
    }
  },
}