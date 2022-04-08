<template>
  <v-btn 
    class="btn ma-2"
    fab
    :dark="value"
    @click="$emit('input', !value)"
  >
    <v-icon
      large
    >mdi-history</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'HistoryBtn',
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
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>