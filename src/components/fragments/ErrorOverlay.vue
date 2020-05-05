<template>
  <v-overlay absolute :value="show" color="#000000" opacity="0.8">
    <p class="headline white--text no-select ma-0">
      {{title||'Embed Not Allowed'}}
    </p>
  </v-overlay>
</template>

<script>
export default {
  props: {
    title: { type: Boolean|String, default: 'Embed Not Allowed' },
    show: { type: Boolean, default: false },
  }
}
</script>

<style scoped>
.no-select {
  -webkit-user-select: none;    
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>