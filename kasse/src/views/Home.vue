<template>
<div class="d-flex justify-space-around">
  <v-row >
    <v-col v-for="item in items" :key="item.path" >
      <v-btn width="200px" height="200px" color="primary" class="ma-15" @click="$router.replace(item.path)">{{item.name}}</v-btn>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
        items: []
    }
  },
  created() {
    this.$router.options.routes.forEach(route => {
        this.items.push({
            name: route.name, 
            path: route.path
        })
    })
  }
}
</script>
