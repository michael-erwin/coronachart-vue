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
/* Scrollbar style */
*::-webkit-scrollbar
{
	width: 12px;
	background-color: #c0c0c0;
}
*::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #c0c0c0;
}
*::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 1px 1px 1px rgba(0,0,0,.3);
	background-color: #ffffff;
  cursor: pointer;
}
</style>