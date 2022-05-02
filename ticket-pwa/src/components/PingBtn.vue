<template>
  <v-btn 
    v-if="!value"
    class="btn ma-2 pulse"
    :color="value ? 'green' : 'red'"
    fab
    dark
    @click="$emit('click')"
  >
    <v-icon
      large
    >mdi-access-point</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'PingBtn',
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
  left: 5px;
}
</style>