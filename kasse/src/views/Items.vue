<template>
  <v-container>
    <ItemGrid :tag="tag" :actions="params[tag].actions"/>
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
  },
  data() {
    return {
      params: {
        hp: {
          actions: false,
        },
        bar: {
          actions: true
        }
      }
    }
  },
}
</script>

<style>

</style>