<template>
  <div>
    <v-btn 
      class="btn ma-2"
      fab
      :dark="value"
      @click="open()"
    >
      <v-icon
        large
      >mdi-ticket-confirmation</v-icon>
    </v-btn>
    <v-dialog 
      v-model="value"
      @click:outside="close()"
      max-width="90%" class="ma-5" elevation="5"
    >
      <v-card >
        <v-card-title>
          <span class="headline">History</span>
        </v-card-title>
        <v-text-field
          class="ma-3"
          v-model="search"
          type="number"
          append-icon="mdi-magnify"
          label="Suche"
          single-line
          hide-details
        />
        <v-data-table
          elevation="0"
          :items-per-page="5"
          :headers="headers"
          :items="items"
          :search="search"
          sort-by="time"
          :sort-desc="true"
          class="elevation-12"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'AllTickets',
  props: {
    apiUrl: {
      type: String,
      required: true
    },
  },
  data: () => ({
    value: false,
    search: '',
    items: [],
    headers: [
      {
        text: 'Zeitpunkt',
        value: 'time',
        sortable: true
      },
      {
        text: 'ID',
        value: 'id',
        sortable: false
      },
      {
        text: 'VVK',
        value: 'vvk',
        sortable: true
      },
      {
        text: 'Eingecheckt',
        value: 'checked',
        sortable: true
      },
      {
        text: 'Aktiviert',
        value: 'activeted',
        sortable: true
      }
    ],
  }),
  methods: {
    async open() {
      this.value = true
      let data = await this.load()
      console.log(data)
      this.items = this.parse(data)
    },
    close() {
      this.value = false
    },
    parse(data) {
      let items = []
      for (id in data) {
        items.push({
          id: id,
          time: new Date(data[id].time).toLocaleString(),
          vvk: data[id].vvk,
          checked: data[id].checked == "1" ? 'Ja' : 'Nein',
          activeted: data[id].activeted == "1" ? 'Ja' : 'Nein'
        })
      }
    },
    async load() {
      const url = this.apiUrl + 'tickets'
      const response = await fetch(url)
      const data = await response.json()
      return data.data
    }
  },
  mounted() {
    console.log('ServerHistory mounted')
    this.load()
  },
})
</script>

<style scoped>
.btn{
  top: 5px;
  right: 5px;
}
</style>