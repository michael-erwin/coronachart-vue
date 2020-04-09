import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '@/views/NotFound.vue'
import Home from '@/views/Home.vue'
import Stats from '@/views/Stats.vue'
import TotalWorld from '@/views/TotalWorld.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/summary/world',
    name: 'TotalWorld',
    component: TotalWorld
  },
  {
    path: '/stats/:code([a-z]{2})',
    name: 'Stats',
    component: Stats
  },
  {
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
