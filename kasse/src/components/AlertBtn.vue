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
    payload: { type: String, default: '_' }
  },
  computed: {
    ...mapState([
      'api',
      'stream'
    ]),
    eventSource(){
      return new EventSource("http://127.0.0.1:8090/api/realtime")//this.stream)
    }
    },
  methods: {
    async onClick() {
      this.loading = true
      const id = await this.createAltert()
      if (id){
        this.alert = true
        setTimeout(() => {
          this.alert = false
        }, 10000)
      }
      this.loading = false
    },
    async createAltert() {
      const URL = this.api + '/alerts/records'
      const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            active:true,
            from: this.payload
          })
        }
      )
      const alterId = (await response.json()).id
      return alterId
    }
  },
  mounted(){
    var that = this
    this.eventSource.addEventListener('alerts', function(event) {
       var data = JSON.parse(event.data)
        console.log("SSE",data)
      //  that.alert = data.alert
    }.bind(that), false)
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


