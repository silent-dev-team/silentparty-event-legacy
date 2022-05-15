<template>
  <v-btn 
    v-if="!entry"
    class="btn pulse ma-2"
    color="red"
    icon
    dark
    large
    @click="$emit('click')"
  >
    <v-icon
      x-large
    >mdi-locker</v-icon>
  </v-btn>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'EntrySign',
  props: {
    api: {
      type: String,
      required: true,
    },
    stream: {
      type: String,
      required: true,
    }
  },
  data: () => ({
    entry:true
  }),
  computed: {
    eventSource(){
      return new EventSource(this.stream)
    }
  },
  methods: {
    async fetch_entry(){
      const URL = this.api + 'entry'
      const response = await fetch(URL)
      const r = await response.json()
      this.entry = r.entry
    },
  },
  mounted() {
    var that = this
    this.eventSource.addEventListener('entry', function(event) {
        var data = JSON.parse(event.data)
        that.entry = data.entry
    }.bind(that), false)
  }
})
</script>

<style scoped>
.btn{
  top: 100px;
  left: 50%; 
  transform: translate(-64%)
}
</style>