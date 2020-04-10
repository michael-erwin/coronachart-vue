<template>
  <v-container light>
    <h1 class="title">Summary Charts</h1>
  </v-container>
</template>

<script>
import ApiFetchers from '@/mixins/ApiFetchers'
import QueryString from '@/mixins/QueryString'
export default {
  mixins: [ QueryString, ApiFetchers ],
}
</script>
