<template>
  <v-btn 
    :class="'ma-2 btn ' +(!entry ? 'pulse' : '')"
    fab
    :color="!entry ? 'red' : 'white'"
    @click="onClick()"
  >
    <v-icon v-if="entry" large color="black">mdi-locker</v-icon>
    <v-icon v-else x-large color="white">mdi-locker</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'EntryBtn',
  data() {
    return {
      entry: true,
      loading: false
    }
  },
  props: {
    api:{
      type: String,
      required: true,
    },
    stream:{
      type: String,
      required: true,
    }
  },
  computed: {
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
    
    var that = this
    this.eventSource.addEventListener('entry', function(event) {
        var data = JSON.parse(event.data)
        that.entry = data.entry
    }.bind(that), false)

    setInterval(() => {
        this.refetch()
      }, 60*1000
    )
  },
  update(){
    this.fetch()
  }
}
</script>

<style scoped>
.btn{
  top: 100px;
  left: 50%; 
  transform: translate(-64%)
}
</style>>


