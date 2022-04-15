import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    api: 'http://localhost:5000/', //'https://api.sp/',
    stream: 'http://localhost/stream', //'https://sp/stream',
    targets: {
      items: {
        route: 'shopItems',
        mutation: 'setItems'
      },
      orders: {
        route: 'orders',
        mutation: null
      }
    },
    order: [],
    items: [],
  },
  getters:{
    sum(state) {
      let sum = state.order.reduce((acc, cur) => acc + cur.price, 0)
      return (parseFloat(sum).toFixed(2))
    },
    item: (state) => (id) => {
      return state.items.find(item => item.id === id)
    }
  },
  mutations: {
    appendOrder (state, payload) {
      const indexOrder = state.order.findIndex((o => o.id == payload.id))
      const item = state.items.find(item => item.id == payload.id)
      const factor = item.price < 0 ? -1 : 1
      const newOrder = {
        id: payload.id,
        name: item.name,
        number: payload.number,
        price: item.price * payload.number * factor,
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
    },
    async post ({ commit, state }, payload) {
      const target = payload.target
      const data = payload.data
      console.log('posting '+target)
      const params = state.targets[target]
      const response = await fetch(state.api+params.route,
          {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(data)
          }
        )
      const response_json = await response.json()
      commit(params.mutation, response_json.data)
    },
    postOrder ({dispatch, commit, getters, state}) {
      const payload = {
        target: 'orders',
        data: {
          items: state.order,
          sum: parseFloat(getters.sum)
        }
      }
      console.log(payload)
      dispatch('post', payload)
      commit('clearOrder')
    }
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
