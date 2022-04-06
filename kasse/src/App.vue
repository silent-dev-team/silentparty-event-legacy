<template>
  <v-app>
    <v-navigation-drawer
      v-model="showOrder"
      app
      width="300"
      right
      fixed
    >
      <OrderList 
        v-model="order"
      />
    </v-navigation-drawer>
    <v-main>
      <CheckOut v-model="checkout" />
      <div>
        <v-btn
          class="hide-btn" 
          :style="'right: '+border+'px;'"
          @click="showOrder = !showOrder"
          icon
        >
          <v-icon v-if="showOrder">
            mdi-chevron-right
          </v-icon>
          <v-icon v-else>
            mdi-chevron-left
          </v-icon>
        </v-btn>
      </div>
      <div>
        <router-view />
      </div>
    </v-main>
    <v-footer 
      padless
      style="z-index: 100;"
      color="teal darken-4"
      dark
      fixed
    >
    <v-col
      class="text-center"
      cols="8"
    >
      <v-btn @click="checkout = true" text width="100%" height="50px">
        <h1>BEZAHLEN</h1>
      </v-btn>
    </v-col>
    <v-col
      class="text-right"
      cols="4"
    >
      <h1>{{sum}}€</h1>
    </v-col>
  </v-footer>
  </v-app>
</template>

<script>
import OrderList from '@/components/OrderList.vue'
import CheckOut from '@/components/CheckOut.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    OrderList,
    CheckOut
  },

  data: () => ({
    showOrder: false,
    checkout: false,
  }),

  computed: {
    ...mapState([
      'order'
    ]),
    ...mapGetters([
      'sum'
    ]),
    border(){
      return this.showOrder ? 300 : 0
    }
  },
  methods: {
    checkOrder() {
      this.showOrder = this.order.length > 0
    }
  },
  watch: {
    order(newOrder){
      this.checkOrder()
    },
    sum(newSum){
      this.checkOrder()
    }
  },
  mounted() {
    this.checkOrder()
  },
};
</script>

<style scoped>
.hide-btn{
  position: fixed;
  top: 50%;
}
</style>