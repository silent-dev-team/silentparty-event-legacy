<template>
  <div>
    <StornoTable></StornoTable>
  </div>
</template>

<script>
import StornoTable from '@/components/StornoTable.vue'
export default {
  name: 'History',
  components: {
    StornoTable
  },
  methods: {
    reload(){
      this.$refs.StornoTable.load()
    }
  }
}
</script>

<style>

</style>