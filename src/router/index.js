import Vue from 'vue'
import VueRouter from 'vue-router'

// Main Pages
import NotFound from '@/views/NotFound.vue'
import Home from '@/views/Home.vue'
import Catalogue from '@/views/Catalogue.vue'

// Embed Contents.
import EmbedSummaryWidget from '@/views/embeds/SummaryWidget.vue'

// Catalog Contents.
import CatalogueSummaryWidgetsPage from '@/views/catalogue-contents/SummaryWidgetsPage.vue'
import CatalogueSummaryChartsPage from '@/views/catalogue-contents/SummaryChartsPage.vue'
import CatalogueTimeSeriesChartsPage from '@/views/catalogue-contents/TimeSeriesChartsPage.vue'
import CatalogueDataTablesPage from '@/views/catalogue-contents/DataTablesPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/catalogue',
    component: Catalogue,
    children: [
      { path: 'summary-widgets', component: CatalogueSummaryWidgetsPage, alias: '/' },
      { path: 'summary-charts', component: CatalogueSummaryChartsPage },
      { path: 'time-series-charts', component: CatalogueTimeSeriesChartsPage },
      { path: 'data-tables', component: CatalogueDataTablesPage },
    ]
  },
  {
    path: '/embeds/summary-widget',
    component: EmbedSummaryWidget,
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
