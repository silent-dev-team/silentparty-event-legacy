<template>
  <v-badge
    overlap
    :content="n"
    :value="n != 0"
    color="red"
  >
    <slot />
  </v-badge>
</template>

<script>
export default {
  name: "Badge",
  props: ['id'],
  computed: {
    n() {
      return this.$store.getters.numberOfItemInOrder(this.id)
    }
  }
}
</script>

<style>

</style>