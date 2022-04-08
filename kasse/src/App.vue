<template>
  <v-app>
    <v-navigation-drawer
      v-model="showOrder"
      app
      width="300"
      right
      fixed
      :permanent="locked"
      mobile-breakpoint="xs"
    >
      <OrderList 
        v-model="order"
      />
    </v-navigation-drawer>
    <v-main>
      <CheckOut v-model="checkout" />
      <div>
        <v-btn
          v-if="!locked"
          class="hide-btn" 
          :style="'right: '+border+'px;'"
          @click="showOrder = !showOrder"
          icon
          large
        >
          <v-icon v-if="showOrder">
            mdi-chevron-right
          </v-icon>
          <v-icon v-else>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn
          v-if="showOrder || locked"
          class="lock-btn"
          @click="locked = !locked; showOrder = true"
          icon
          large
        >
          <v-icon v-if="!locked">
            mdi-lock-open-outline
          </v-icon>
          <v-icon v-else>
            mdi-lock-outline
          </v-icon>
        </v-btn>
      </div>
      <div>
        <router-view />
      </div>
    </v-main>
    <div height="200px"></div>
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    OrderList,
    CheckOut
  },

  data: () => ({
    showOrder: false,
    checkout: false,
    locked: false
  }),

  computed: {
    ...mapState([
      'order'
    ]),
    ...mapGetters([
      'sum'
    ]),
    border(){
      return this.showOrder ? 256 : 0
    }
  },
  methods: {
    ...mapActions([
      'fetch'
    ]),
    checkOrder() {
      if (this.$vuetify.breakpoint.xsOnly){
        this.showOrder = false
      } else {
        this.showOrder = this.order.length > 0
      }
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
    this.fetch('items')
  },
};
</script>

<style scoped>
.hide-btn{
  z-index: 10;
  position: fixed;
  top: 50%;
}
.lock-btn{
  z-index: 10;
  position: fixed;
  bottom: 75px;
  right: 256px;
}
</style>