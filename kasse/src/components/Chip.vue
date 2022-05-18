<template>
  <div :class="checkout ? 'btn-chip-checkout' : 'btn-chip'">
    <Badge :id="chipId">
      <v-btn @click="addChip()" color="yellow" fab x-large>
        <v-icon x-large>mdi-circle-multiple</v-icon>
      </v-btn>
    </Badge>
  </div>
</template>

<script>
import Badge from '@/components/Badge.vue'
import { mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  name: 'Chip',
  components: {
    Badge
  },
  props: {
    checkout: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chipId: 0,
      lastOrder: null,
    }
  },
  computed: {
    ...mapState([
      'order'
    ]),
    ...mapGetters([
      'numberOfItemInOrder'
    ])
  },
  methods: {
    ...mapMutations([
      'appendOrder',
      'delPosFromOrder'
    ]),
    addChip(excludeIds=[]) {
      const chipNumber = this.numberOfItemInOrder(this.chipId)

      const sum = this.order.reduce((psum, item) => {
        if (excludeIds.includes(item.id)) {
          return psum + item.number
        }
        return psum
      }, 0)
      const chipItems = this.order
        .filter(item => item.chip)
        .filter(item => !excludeIds.includes(item.id))
      if (chipItems.length === 0) {
        console.log('no more drinks')
        return
      }
      const expItem = chipItems.reduce((a,b)=>a.price>b.price?a:b)
      if (chipNumber >= expItem.number+sum) {
        excludeIds.push(expItem.id)
        this.addChip(excludeIds)
        return
      }
      this.appendOrder({
        id: this.chipId,
        price: -expItem.price,
        number: 1
      })
      if (this.order.at(-1).id !== this.chipId && this.lastOrder !== this.order) {
        this.delPosFromOrder(this.chipId)
        this.chipLoop(chipNumber+1)
      }
    },
    chipLoop(times){
      for (let i = 0; i < times; i++) {
        this.addChip()
      }
    }
  },
}
</script>