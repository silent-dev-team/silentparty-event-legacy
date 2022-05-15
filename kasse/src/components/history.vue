<template>
  
</template>

<script>
export default {
  name: "History",
  data() {
    return {
      route: 'history',
    }
  },
  computed: {
    ...mapState([
      'api',
      'orders'
    ]),
  },
  methods: {
    async fetchOrders() {
      const response = await fetch(this.api+params.route)
    },
  }
}
</script>

<style>

</style>