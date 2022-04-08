<template>
  <v-btn 
    class="btn ma-2"
    style="top: 5px; left: 5px;"
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
  position: absolute;
  top: 5px;
  left: 5px;
}
</style>