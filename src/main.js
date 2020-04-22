import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueApexCharts from 'vue-apexcharts'
import fullscreen from 'vue-fullscreen'

Vue.use(VueApexCharts)
Vue.use(fullscreen)
Vue.component('apexchart', VueApexCharts)
Vue.config.productionTip = false

axios.interceptors.response.use( r => r, (error) => {
  if (error.response.status == 401) {
    router.push({ path: '/chart-forbidden'})
  } else {
    return Promise.reject({ ...error })
  }
})

Vue.prototype.$axios = axios

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
