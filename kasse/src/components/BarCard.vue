<template>
  <v-card width="350px" elevation="5">
    <v-card 
      class="pa-3 d-flex justify-space-between" 
      elevation="0"
    >
      <h1>{{item.name}}</h1>
      <h1>{{item.price}}€</h1>
    </v-card>
    <v-card 
      elevation="0"
      @click="append()"
    >
      <v-img
        src="https://www.prost.com/img/de/hannover/bars/k4-bar-2-slider_item.jpeg"
        height="200px"
        class="white--text align-center justify-center"
      >
        <!--<v-icon width="1000px" class="mx-auto" color="white">mdi-plus</v-icon>-->
      </v-img>
    </v-card>
    <v-card-actions class="d-flex justify-space-around">
      <v-btn 
        text 
        :disabled="n==1"
        x-large 
        color="primary" 
        @click="sub()"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-card class="text-center" elevation="0" >
        <v-card-title>{{n}}</v-card-title>
      </v-card>
      <v-btn 
        text
        x-large 
        color="primary" 
        @click="add()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'BarCard',
  props: {
    id: Number,
  },
  data () {
    return {
      n: 1,
    }
  },
  computed: {
    item(){
      return this.$store.getters.item(this.id)
    },
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
      this.appendOrder({
        id: this.id,
        number: this.n
      })
      this.n=1
    }
  }
}
</script>

<style>

</style>