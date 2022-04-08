<template>
  <v-btn 
    v-if="value"
    class="btn pulse ma-2"
    color="red"
    icon
    dark
    @click="$emit('click')"
  >
    <v-icon
      x-large
    >mdi-close-octagon</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'EntrySign',
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style scoped>
.btn{
  top: 15px; 
  left: 50%; 
  transform: translate(-75%)
}
</style>