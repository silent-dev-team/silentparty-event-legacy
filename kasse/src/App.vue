<template>
  <v-app>
    <OrderDrawer 
      v-model="showOrder" 
      lockeble
    />
    <v-main>
      <CheckOut v-model="checkout" />
      <div>
        <router-view />
      </div>
    </v-main>
    <EntryBtn />
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
import OrderDrawer from '@/components/OrderDrawer.vue'
import CheckOut from '@/components/CheckOut.vue'
import EntryBtn from '@/components/EntryBtn.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    OrderList,
    OrderDrawer,
    CheckOut,
    EntryBtn
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
    },
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
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

<style>
.pulse {
  display: block;
  cursor: pointer;
  animation: pulse 1s infinite;
}
.pulse:hover {
  animation: none;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(204, 44, 44, 0.4);
  }
  70% {
    -webkit-box-shadow: 0 0 0 10px rgba(204, 44, 44, 0);
  }
  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(204, 44, 44, 0);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 44, 44, 0.4);
    box-shadow: 0 0 0 0 rgba(204, 44, 44, 0.4);
  }
  70% {
    -moz-box-shadow: 0 0 0 10px rgba(204, 44, 44, 0);
    box-shadow: 0 0 0 10px rgba(204, 44, 44, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 44, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 44, 44, 0);
  }
}
</style>