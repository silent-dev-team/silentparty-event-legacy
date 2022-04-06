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
        img: 'https://www.fuessenaktuell.de/wp-content/uploads/2019/08/FA_09_19_Bier.jpg',
        price: 2.5
      },
      {
        id: 101,
        name: 'Cola',
        img: 'https://www.cocacolaep.com/assets/Uploads/resources/04996d7841/Neue-Verschlusse-Coca-Cola900x550__ScaleMaxWidthWzk0MF0.jpg',
        price: 1.5
      },
      {
        id: 102,
        name: 'Fanta',
        img: 'https://www.bestinfood-shop.de/media/image/ff/23/b3/fanta-orange-dose-24x-330ml-95451-7771534.jpg',
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
