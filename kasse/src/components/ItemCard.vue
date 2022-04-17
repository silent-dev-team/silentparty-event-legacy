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
      @click="append()"
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
        :disabled="n==1"
        x-large 
        color="primary" 
        @click="sub()"
      >
        <v-icon x-large>mdi-minus</v-icon>
      </v-btn>
      <v-card class="text-center" elevation="0" >
        <v-card-title>{{n}}</v-card-title>
      </v-card>
      <v-btn 
        icon
        x-large 
        color="primary" 
        @click="add()"
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
      default: '160px',
      type: String,
    },
    maxWidth: {
      default: '200px',
      type: String,
    },
  },
  data () {
    return {
      n: 1,
    }
  },
  computed: {
    item(){
      return this.$store.getters.item(this.id)
    }
  },
  methods: {
    ...mapMutations([
      'appendOrder'
    ]),
    add(){
      this.n++
    },
    sub(){
      if (this.n > 1) {
        this.n--
      }
    },
    append(){
      const deposit_factor = this.item.deposit ? -1 : 1
      if (this.item.reference !== null) {
        this.appendOrder({
          id: this.item.reference,
          number: this.n
        })
      }
      this.appendOrder({
        id: this.id,
        number: this.n * deposit_factor
      })
      this.n=1
    },
    fix(str){
      return parseFloat(str).toFixed(2)
    },
  }
}
</script>

<style>

</style>