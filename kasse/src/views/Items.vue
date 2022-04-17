<template>
  <v-container>
    <ItemGrid :tag="tag"/>
    <div height="200px"></div>
  </v-container>
</template>

<script>
import ItemGrid from '@/components/ItemGrid.vue'
import Badge from '@/components/Badge.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Items',
  components: {
    ItemGrid,
    Badge
  },
  props: {
    tag: {
      type: String,
      required: true,
    }
  }
}
</script>

<style>

</style>