<template>
  <div class="home">
    <center>
    <v-btn width="400px" height="200px" color="primary" class="ma-15" @click="$router.replace('/bar')">Bar</v-btn>
    </center>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Home',
  components: {
  }
}
</script>
