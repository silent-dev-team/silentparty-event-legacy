import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    order: [],
    items: [
      {
        id: 100,
        name: 'Bier',
        price: 2.5
      },
      {
        id: 101,
        name: 'Cola',
        price: 1.5
      }
    ],
  },
  getters:{
    sum(state) {
      let sum = state.order.reduce((acc, cur) => acc + cur.price, 0)
      return parseFloat(sum).toFixed(2)
    },
    item: (state) => (id) => {
      return state.items.find(item => item.id === id)
    }
  },
  mutations: {
    appendOrder (state, payload) {
      const indexOrder = state.order.findIndex((o => o.id == payload.id))
      const item = state.items.find(item => item.id == payload.id)
      const newOrder = {
        id: payload.id,
        name: item.name,
        number: payload.number,
        price: item.price * payload.number,
      }
      console.log(indexOrder)
      if (indexOrder < 0) {
        state.order.push(newOrder)
      } else {
        state.order[indexOrder].price = state.order[indexOrder].price + newOrder.price
        state.order[indexOrder].number = state.order[indexOrder].number + newOrder.number
      }
    },
    clearOrder (state) {
      state.order = []
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
