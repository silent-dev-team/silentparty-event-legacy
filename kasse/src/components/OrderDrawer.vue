<template>
<div>
  <v-navigation-drawer
      v-model="showOrder"
      app
      width="300"
      right
      fixed
      :permanent="locked"
      mobile-breakpoint="xs"
    >
      <OrderList />
  </v-navigation-drawer>
  <div>
    <v-btn
      v-if="!locked"
      class="hide-btn" 
      :style="'right: '+border+'px;'"
      @click="toggle()"
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
      @click="locked = !locked; show()"
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
</div>
</template>

<script>
import OrderList from '@/components/OrderList.vue'
export default {
  name: 'OrdrDrawer',
  components: {
    OrderList
  },
  props: [
    'showOrder'
  ],
  methods: {
    toggle(){
      this.$emit('input', !this.showOrder)
    },
    show(){
      this.$emit('input', true)
    },
    hide(){
      this.$emit('input', false)
    }
  }
}
</script>

<style>

</style>