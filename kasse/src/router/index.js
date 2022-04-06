import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Bar from '../views/Bar.vue'

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
    component: Bar
  },
  {
    path: '/bar2',
    name: 'Bar',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '@/views/Bar.vue')
    }
  }
]

const router = new VueRouter({
  //mode: "history",
  routes
})

export default router
