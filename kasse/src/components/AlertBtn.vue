<template>
  <v-btn 
    :class="'btn ' + (alert ? 'pulse' : '')"
    fab
    :icon="!alert"
    :color="alert ? 'red' : null"
    @click="onClick()"
  >
    <v-icon v-if="!alert" large color="black">mdi-bell</v-icon>
    <v-icon v-else x-large color="white">mdi-bell</v-icon>
  </v-btn>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'alertBtn',
  data() {
    return {
      alert: false,
      loading: false
    }
  },
  props: {
    payload: { type: String, default: 'alert' }
  },
  computed: {
    ...mapState([
      'api',
      'stream'
    ]),
    eventSource(){
      return new EventSource(this.stream)
    }
    },
  methods: {
    async onClick() {
      this.loading = true
      const r = await this.update(this.payload)
      if (r){
        this.alert = true
        setTimeout(() => {
          this.alert = false
        }, 10000)
      }
      this.loading = false
    },
    async update(payload) {
      const URL = this.api + 'alert'
      const data = {"from": payload}
      const response = await fetch(URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      const r = await response.json()
      return r
    },
  },
  mounted(){
    //var that = this
    //this.eventSource.addEventListener('alert', function(event) {
    //    var data = JSON.parse(event.data)
    //    that.alert = data.alert
    //}.bind(that), false)
  },
}
</script>

<style scoped>
.btn{
  position: fixed;
  z-index: 10;
  bottom: 90px; 
  left: 15px;
}
</style>>


