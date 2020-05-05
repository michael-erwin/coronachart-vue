<template>
  <v-app id="inspire">
    <!-- Nav Drawer -->
    <v-navigation-drawer v-model="drawer" app dark>
      <!-- Nav > Logo -->
      <v-toolbar elevation="1">
        <v-icon class="mx-2 green--text text--accent-3">
          mdi-bacteria-outline
        </v-icon>
        <v-toolbar-title class="mr-12 align-center">
          <span class="title">COVID <span class="green--text text--accent-3">Charts</span></span>
        </v-toolbar-title>
      </v-toolbar>
      <!-- Nav > Links -->
      <v-list dense nav class="mt-2">
        <v-list-item dense v-for="item in items" :key="item.text" :link="item.to?true:false" :to="item.to"
        >
          <v-list-item-action><v-icon>{{ item.icon }}</v-icon></v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
              <v-chip v-if="item.tag" label x-small class="mx-2" color="pink" text-color="white">
                {{item.tag}}
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- Data Source -->
      <v-subheader class="mt-4 grey--text text--darken-1">Data Sources</v-subheader>
      <div class="d-flex flex-wrap mx-4">
        <a v-for="(source, index) of sources" :key="index" class="source-link caption" :href="source.link" target="_blank">
          {{source.text}}
        </a>
      </div>
      <!-- Social Links -->
      <v-subheader class="mt-4 grey--text text--darken-1">Follow Us</v-subheader>
      <div class="d-flex flex-wrap mx-4">
        <v-btn class="mx-1" color="blue darken-1" icon link title="facebook">
          <v-icon color="blue darken-1">mdi-facebook</v-icon>
        </v-btn>
        <v-btn class="mx-1" color="blue" icon link title="twitter">
          <v-icon color="blue">mdi-twitter</v-icon>
        </v-btn>
        <v-btn class="mx-1" color="red" icon link title="youtube">
          <v-icon color="red">mdi-youtube</v-icon>
        </v-btn>
      </div>
    </v-navigation-drawer>
    <!-- /Nav Drawer -->

    <!-- App Bar -->
    <v-app-bar app dark elevation="1">
      <v-app-bar-nav-icon @click.stop="drawer=!drawer" />
      <v-icon class="mx-2 d-lg-none" color="orange">
        mdi-bacteria-outline
      </v-icon>
      <v-toolbar-title class="mr-12 align-center d-lg-none">
        <span class="title">COVID <span class="orange--text">Charts</span></span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- /App Bar -->

    <!-- Content Area -->
    <v-content>
      <router-view></router-view>
    </v-content>
    <!-- /Content Area -->
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      items: [
        { icon: 'mdi-widgets', text: 'Summary Widgets', to: '/catalogue/summary-widgets' },
        { icon: 'mdi-chart-pie', text: 'Summary Charts', to: '/catalogue/summary-charts' },
        { icon: 'mdi-chart-line', text: 'Time Series Charts', to: 'time-series-charts' },
        { icon: 'mdi-table', text: 'Data Tables', to: 'data-tables' },
        { icon: 'mdi-map-legend', text: 'Maps', tag: 'Coming Soon' },
      ],
      sources: [
        { text: 'JHU CSSE', link: 'https://systems.jhu.edu/research/public-health/ncov/' },
        { text: 'TrackCorona', link: 'https://www.trackcorona.live/' },
        { text: 'Wikipedia', link: 'https://en.wikipedia.org/wiki/COVID-19_pandemic_by_country_and_territory/' },
        { text: 'Worldometer', link: 'https://www.worldometers.info/coronavirus/' },
      ]
    }),
  }
</script>

<style scoped>
.source-link {
  margin-left: 8px;
  margin-right: 8px;
  text-decoration: none !important;
  white-space: nowrap;
}
</style>

<style lang="scss">
.embed-data-table {
  .v-data-footer {
    min-height: 48px;
  }
  .flag-icon {
    vertical-align: middle;
  }
}
</style>