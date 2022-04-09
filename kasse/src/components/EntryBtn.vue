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
      loading: false,
      eventSource: new EventSource("https://sp/stream")
    }
  },
  computed: {
    ...mapState([
      'api'
    ]),
    },
  methods: {
    setEntry(value){
      this.entry = value
    },
    async onClick() {
      this.loading = true
      await this.update(!this.entry)
      await this.fetch()
      this.loading = false
    },
    async fetch() {
      const URL = this.api + 'entry'
      const response = await fetch(URL)
      const r = await response.json()
      this.entry = r.entry
      return this.entry
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
    this.fetch()
    var that = this;
    this.eventSource.addEventListener('entry', function(event) {
        var data = JSON.parse(event.data)
        console.log(data.entry)
        that.entry = data.entry
    }.bind(that), false);
  },
  update(){
    this.fetch()
  }
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


