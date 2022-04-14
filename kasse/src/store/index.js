import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    api: 'http://localhost:5000', //'https://api.sp/',
    stream: 'http://localhost:5000/stream', //'https://sp/stream',
    targets: {
      items: {
        route: 'items',
        mutation: 'setItems'
      }
    },
    order: [],
    items: [],
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
    },
    setItems (state, items) {
      state.items = items
    }
  },
  actions: {
    async fetch ({ commit, state }, target) {
      console.log('fetching '+target)
      const params = state.targets[target]
      const response = await fetch(state.api+params.route)
      const response_json = await response.json()
      commit(params.mutation, response_json.data)
    }
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
