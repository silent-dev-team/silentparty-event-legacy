import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    api:  'http://127.0.0.1:8000/',//'https://api.sp/', //'https://api.sp/','http://127.0.0.1:5000/',
    stream: 'http://127.0.0.1:8000/stream',//'https://sp/stream', //'http://127.0.0.1:5000/stream',
    imgLocation: 'http://127.0.0.1:8000/storage/img/',//'https://sp/storage/img/', //'https://127.0.0.1:5000/storage/img/',
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
    orders: [],
    items: [],
  },
  getters:{
    getImg: (state) => (img) => {
      return state.imgLocation + img
    },
    sum(state) {
      let sum = state.order.reduce((acc, cur) => acc + cur.sum, 0)
      return (parseFloat(sum).toFixed(2))
    },
    item: (state) => (id) => {
      return state.items.find(item => item.id === id)
    },
    numberOfItemInOrder: (state) => (id) => {
      let n = 0
      for (const item of state.order) {
        if (item.id === id) {
          n = item.number
        }
      }
      return n
    }
  },
  mutations: {
    appendOrder (state, payload) {
      const indexOrder = state.order.findIndex((o => o.id == payload.id))
      const item = state.items.find(item => item.id == payload.id)
      const price = payload.price || item.price
      console.log('price', price)
      const newOrder = {
        id: payload.id,
        name: item.name,
        number: payload.number,
        chip: item.chip,
        price: price,
        sum: price * payload.number,
      }
      console.log(indexOrder)
      if (indexOrder < 0) {
        state.order.push(newOrder)
      } else {
        state.order[indexOrder].sum = state.order[indexOrder].sum + newOrder.sum
        state.order[indexOrder].number = state.order[indexOrder].number + newOrder.number
      }
      if (this.getters.numberOfItemInOrder(payload.id) == 0) {
        this.commit('delPosFromOrder', payload.id)
      }
    },
    clearOrder (state) {
      state.order = []
    },
    delPosFromOrder (state, id) {
      state.order
      var i = state.order.map(item => item.id).indexOf(id)
      ~i && state.order.splice(i, 1)
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

