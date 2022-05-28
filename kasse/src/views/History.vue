<template>
  <div>
    <v-btn 
      class="btn-back"
      icon 
      x-large
      @click="$router.go(-1)"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <StornoTable></StornoTable>
  </div>
</template>

<script>
import StornoTable from '@/components/StornoTable.vue'
export default {
  name: 'History',
  components: {
    StornoTable
  }
}
</script>

<style scoped>
.btn-back{
  position: absolute;
  top: 5px;
  left: 5px;
}
.btn-refresh{
  position: absolute;
  top: 5px;
  right: 5px;
}

</style>