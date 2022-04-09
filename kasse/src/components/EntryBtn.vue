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
  computed: 
    mapState([
      'api'
    ]),
  methods: {
    onClick() {
      this.loading = true
      this.update(!this.entry)
      this.fetch()
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
    setInterval(() => {
      this.fetch()
    }, 1000)
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


