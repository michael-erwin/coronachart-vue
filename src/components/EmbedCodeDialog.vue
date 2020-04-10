<template>
  <v-dialog :value="show"
    @input="(v)=>{$emit('update:show',v)}"
    max-width="600"
  >
    <v-card>
      <v-toolbar dense elevation="0">
        <v-toolbar-title>Embed Code</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="px-3">
        <p>Copy and paste this code to your site</p>
        <v-textarea outlined dense
          spellcheck="false"
          class="code-area"
          :value="value"
          @click="(e)=>{e.target.select()}"
        />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  methods: {
    close () { this.$emit('update:show', false) },
  },
  props: {
    show: { type: Boolean, default: false },
    value: { type: String, default: '' },
  },
}
</script>

<style>
.code-area
.v-input__slot {
  background-color: #323232 !important;
}
textarea {
  color: whitesmoke !important;
  font-family: 'Courier New', Courier, monospace;
}
</style>