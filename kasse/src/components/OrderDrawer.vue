<template>
<div>
  <v-navigation-drawer
    v-model="value"
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
      <v-icon v-if="value">
        mdi-chevron-right
      </v-icon>
      <v-icon v-else>
        mdi-chevron-left
      </v-icon>
    </v-btn>
    <v-btn
      v-if="value || locked"
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
  name: 'OrderDrawer',
  components: {
    OrderList
  },
  props: [
    'value'
  ],
  data() {
    return {
      locked: false
    }
  },
  computed: {
    border(){
      return this.value ? 256 : 0
    }
  },
  methods: {
    toggle(){
      this.$emit('input', !this.value)
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