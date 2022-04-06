<template>
  <div class="home">
    <center>
    <v-btn width="300px" color="primary" class="ma-15" @click="$router.push('/bar')">Bar</v-btn>
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
