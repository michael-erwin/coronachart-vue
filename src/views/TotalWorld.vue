<template>
  <total-numbers />
</template>

<script>
import TotalNumbers from '@/components/TotalNumbers'
export default {
  components: { TotalNumbers },
  mounted () {
    const wrap1 = document.querySelector('.v-application')
    const wrap2 = document.querySelector('.v-application--wrap')
    wrap1.setAttribute('style', 'background-color: transparent !important')
    wrap2.setAttribute('style', 'background-color: transparent !important')
    // wrap2.style.backgroundColor = 'transparent'
    // document.body.style.backgroundColor = 'transparent'
  },
}
</script>

<style>
/* html, body,
.theme--light.v-application,
.v-application--wrap {
  background-color: transparent !important;
} */
</style>
