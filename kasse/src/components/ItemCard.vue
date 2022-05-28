<template>
  <v-card :max-width="maxWidth" :min-width="minWidth" elevation="5">
    <v-card 
      class="pa-3 d-flex justify-space-between" 
      elevation="0"
      :color="item.deposit ? 'yellow' : null"
    >
      <h1>{{ item.name }}</h1>
      <h1>{{ fix(item.price) }}€</h1>
      
    </v-card>
    <v-card 
      elevation="0"
      @click="append(item.id == 100 ? -1 : 1)"
    >
      <v-img
        :src="$store.getters.getImg(item.img)"
        height="100px"
        class="white--text align-center justify-center"
      >
        <!--<v-icon width="1000px" class="mx-auto" color="white">mdi-plus</v-icon>-->
      </v-img>
    </v-card>
    <v-card-actions v-if="actions" class="d-flex justify-space-around">
      <v-btn 
        icon 
        :disabled="!item.deposit && n<1"
        x-large 
        color="primary" 
        @click="append(-1)"
      >
        <v-icon x-large>mdi-minus</v-icon>
      </v-btn>
      <v-btn 
        icon
        x-large 
        color="primary" 
        @click="append(1)"
      >
        <v-icon x-large>mdi-plus</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ItemCard',
  props: {
    id: Number,
    actions: {
      type: Boolean,
      default: false,
    },
    minWidth: {
      default: '200px',
      type: String,
    },
    maxWidth: {
      default: '200px',
      type: String,
    },
  },
  computed: {
    item(){
      return this.$store.getters.item(this.id)
    },
    n() {
      return this.$store.getters.numberOfItemInOrder(this.id)
    }
  },
  methods: {
    ...mapMutations([
      'appendOrder'
    ]),
    append(n){
      if (this.item.reference !== null) {
        this.appendOrder({
          id: this.item.reference,
          number: n
        })
      }
      this.appendOrder({
        id: this.id,
        number: n
      })
    },
    fix(str){
      return parseFloat(str).toFixed(2)
    },
  }
}
</script>

<style>

</style>