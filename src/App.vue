<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
html, body {
  overflow-y: auto !important;
}
.v-application--wrap {
  background-color: #eee !important;
}
.dense-field .v-text-field__details,
.country-search .v-text-field__details,
.date-selector .v-text-field__details {
  display: none !important;
}
.switch-chart .type-selector {
  max-width: 150px;
}
.switch-chart .chart-box {
  height: 480px;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 7;
  background-color: white;
}
@media (max-width: 1264px) {
  .switch-chart .chart-box {
    height: 400px;
  }
}
</style>