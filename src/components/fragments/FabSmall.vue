<template>
  <v-btn fab small
    class="white--text"
    elevation="1"
    color="grey darken-2"
    @click="$emit('click')"
  >
    <v-icon>{{icon||'mdi-code-braces'}}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: { icon: String }
}
</script>
