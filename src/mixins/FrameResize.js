export default {
  methods: {
    resize (height) {
      const i = this.query.id
      const v = Number.isInteger(height) ? height : this.$refs.app.$el.offsetHeight
      const data = { i , v }
      parent.postMessage(data, '*')
    }
  },
}