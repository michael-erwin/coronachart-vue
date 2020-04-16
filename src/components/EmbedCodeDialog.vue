<template>
  <v-dialog :value="show" overlay-color="rgba(255,255,255,0)" persistent
    @input="(v)=>{$emit('update:show',v)}"
    max-width="600"
  >
    <v-card>
      <v-toolbar dense elevation="0" color="grey darken-3" class="white--text">
        <v-toolbar-title class="white--text">{{title}}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close" dark>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="pa-4">
        <slot name="top"></slot>
        <div class="mb-1">Copy and paste this code to your site</div>
        <v-textarea outlined dense readonly hide-details
          spellcheck="false"
          class="code-area"
          :value="value"
          @click="(e)=>{e.target.select()}"
        />
        <slot name="bottom"></slot>
      </div>
      <v-card-actions>
        <slot name="actions"></slot>
      </v-card-actions>
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
    title: { type: String, default: 'Embed Code' },
    value: { type: String, default: '' },
  },
}
</script>

<style>
.code-area
.v-input__slot {
  background-color: #424242 !important;
}
.v-input__slot textarea {
  color: whitesmoke !important;
  font-family: 'Courier New', Courier, monospace;
  margin-top: 0 !important;
  min-height: 200px !important;
  max-height: 400px;
}
</style>