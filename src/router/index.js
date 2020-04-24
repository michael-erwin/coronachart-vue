import Vue from 'vue'
import VueRouter from 'vue-router'

// Main Pages
import NotFound from '@/views/NotFound.vue'
import Index from '@/views/Index.vue'
import Catalogue from '@/views/Catalogue.vue'
import ChartForbidden from '@/views/ChartForbidden.vue'

// Embed Contents.
import EmbedSummaryWidget1 from '@/views/embeds/EmbedSummaryWidget1.vue'
import EmbedSummaryChart1 from '@/views/embeds/EmbedSummaryChart1.vue'
import EmbedSummaryChart2 from '@/views/embeds/EmbedSummaryChart2.vue'
import EmbedSummaryChart3 from '@/views/embeds/EmbedSummaryChart3.vue'
import EmbedDataTable1 from '@/views/embeds/EmbedDataTable1.vue'
import EmbedDataTable2 from '@/views/embeds/EmbedDataTable2.vue'

// Catalog Contents.
import CatalogueSummaryWidgetsPage from '@/views/catalogue-contents/SummaryWidgetsPage.vue'
import CatalogueSummaryChartsPage from '@/views/catalogue-contents/SummaryChartsPage.vue'
import CatalogueTimeSeriesChartsPage from '@/views/catalogue-contents/TimeSeriesChartsPage.vue'
import CatalogueDataTablesPage from '@/views/catalogue-contents/DataTablesPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/chart-forbidden',
    component: ChartForbidden,
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
    path: '/embeds/summary-widget-1',
    component: EmbedSummaryWidget1,
  },
  {
    path: '/embeds/summary-chart-1',
    component: EmbedSummaryChart1,
  },
  {
    path: '/embeds/summary-chart-2',
    component: EmbedSummaryChart2,
  },
  {
    path: '/embeds/summary-chart-3',
    component: EmbedSummaryChart3,
  },
  {
    path: '/embeds/data-table-1',
    component: EmbedDataTable1,
  },
  {
    path: '/embeds/data-table-2',
    component: EmbedDataTable2,
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
