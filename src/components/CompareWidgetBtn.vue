<template>
  <v-menu offset-y left :close-on-content-click="false" max-width="250">
    <template v-slot:activator="{ on }">
      <v-btn dark icon v-on="on" color="primary" class="ml-1">
        <v-badge overlap
          :content="amount"
          :value="amount"
          color="red"
        >
          <v-icon>mdi-compare</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-list dense style="border-radius: 0px">
      <v-list-item dense v-for="(item, index) in items" :key="index">
        <img :src="getFlagURL(item)" width="24" class="mr-1" />
        <v-list-item-content class="px-0">
          
          <v-list-item-title>{{ countryNames[item] }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon small color="red darken-1" dark @click="remove(item)">
            <v-icon title="remove" small>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <div class="white px-1">
      <v-select
        dense outlined single-line
        class="dense-field"
        :value="type"
        :items="compareTypes"
        @change="selectType"
      />
    </div>
    <div class="d-flex justify-space-between pa-1" style="background-color: white">
      <v-btn class="half white--text" color="primary" @click="$emit('compare')"
        :disabled="!enough"
      >Compare</v-btn>
      <v-btn class="half white--text" color="error" @click="$emit('clear')">Clear</v-btn>
    </div>
  </v-menu>
</template>

<script>
export default {
  computed: {
    amount () {
      return this.items.length
    },
    enough () {
      return this.items.length > 1
    }
  },
  data () {
    return {
      compareTypes: [
        {text: 'Compare Basic Stats', value: 'stats'},
        {text: 'Compare Case Trend', value: 'trend'},
      ],
    }
  },
  methods: {
    selectType (type) {
      this.$emit('update:type', type)
    },
    getFlagURL (code) {
      return `https://www.countryflags.io/${code}/flat/24.png`
    },
    remove (code) {
      this.$emit('remove', code)
    }
  },
  props: {
    items: { type: Array, default: ()=> [] },
    type: { type: String, default: 'stats' },
    countryNames: Object
  }
}
</script>

<style scoped>
.half {
  width: calc(50% - 2.5px)
}
</style>