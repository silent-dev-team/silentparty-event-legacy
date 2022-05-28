<template>
  <v-btn 
    :class="'btn ' + (!entry ? 'pulse' : '')"
    fab
    :icon="entry"
    :color="!entry ? 'red' : null"
    @click="onClick()"
  >
    <v-icon v-if="entry" large color="black">mdi-locker</v-icon>
    <v-icon v-else x-large color="white">mdi-locker</v-icon>
  </v-btn>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'EntryBtn',
  data() {
    return {
      entry: true,
      loading: false
    }
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
    setEntry(value){
      this.entry = value
    },
    async onClick() {
      this.loading = true
      await this.update(!this.entry)
      this.loading = false
    },
    async update(status) {
      const URL = this.api + 'entry'
      const data = {"entry": status}
      const response = await fetch(URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      const r = await response.json()
      return r['entry']
    },
  },
  mounted(){
    var that = this
    this.eventSource.addEventListener('entry', function(event) {
        var data = JSON.parse(event.data)
        that.entry = data.entry
    }.bind(that), false)
  },
}
</script>

<style scoped>
.btn{
  position: fixed;
  z-index: 10;
  bottom: 160px; 
  left: 15px;
}
</style>>


