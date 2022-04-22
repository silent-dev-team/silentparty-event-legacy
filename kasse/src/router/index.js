import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Items from '../views/Items.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bar',
    name: 'Bar',
    component: Items,
    props: {
      tag: 'bar'
    }
  },
  {
    path: '/hp',
    name: 'HP',
    component: Items,
    props: {
      tag: 'hp'
    }
  },
  {
    path: '/ak',
    name: 'Abenkasse',
    component: Items,
    props: {
      tag: 'ak'
    }
  },
  {
    path: '/vvk',
    name: 'Vorverkauf',
    component: Items,
    props: {
      tag: 'vvk'
    }
  }, 
]

const router = new VueRouter({
  //mode: "history",
  routes
})

export default router
