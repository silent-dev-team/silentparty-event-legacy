<template>
  <div>
    {{ items }}
    <v-row>
      <v-col 
        v-for="item in taggedItems" :key="item.id"
        xs="12" sm="6" md="4" lg="3" xl="2"
      >
        <div class="mx-auto my-3">
          <Badge :id="item.id">
            <ItemCard :id="item.id" actions />
          </Badge>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ItemCard from '@/components/ItemCard.vue'
import Badge from '@/components/Badge.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ItemGrid',
  components: {
    ItemCard,
    Badge
  },
  props: {
    tag: {
      type:String,
      required: true,
    }
  },
  computed: {
    ...mapState([
      'items'
    ]),
    taggedItems(){
      return this.items.filter(item => item.tags.includes(this.tag))
    },
    param() {
      return this.params[this.tag]
    }
  },
  methods: {
  },
  mounted(){
    console.log(this.items)
  }

}
</script>

<style>

</style>