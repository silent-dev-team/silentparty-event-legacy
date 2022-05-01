<template>
  <v-dialog 
    v-model="value"
    @click:outside="close()"
    max-width="90%" class="ma-5" elevation="5"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn 
        class="btn ma-2"
        fab
        :dark="value"
        @click="open()"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon
          large
        >mdi-ticket-confirmation</v-icon>
      </v-btn>
    </template>
    <v-card >
      <v-card-title>
        <span class="headline">Alle Tickets</span>
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
        mobile-breakpoint="430"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'AllTickets',
  props: {
    api: {
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
        text: 'ID',
        value: 'id',
        sortable: true
      },
      {
        text: 'Eingecheckt',
        value: 'checked',
        sortable: true
      },
      {
        text: 'Checkin Zeit',
        value: 'checkin_time',
        sortable: true
      },
      {
        text: 'Aktiviert',
        value: 'activeted',
        sortable: true
      },
      {
        text: 'Aktiviert Zeit',
        value: 'activation_time',
        sortable: true
      },
      {
        text: 'VVK',
        value: 'vvk',
        sortable: true
      },
    ],
  }),
  methods: {
    async open() {
      this.value = true
      const data = await this.load()
      console.log(data)
      const items = this.parse(data)
      console.log(items)
      this.items = items
    },
    close() {
      this.value = false
    },
    parse(data) {
      let items = []
      for (let id in data) {
        items.push({
          id: id,
          checkin_time: data[id].checkin_time.slice(11, 19),
          activation_time: data[id].activation_time.slice(11, 19),
          vvk: data[id].vvk == "1" ? 'VVK' : 'AK',
          checked: data[id].checked == "1" ? 'Ja' : 'Nein',
          activeted: data[id].activeted == "1" ? 'Ja' : 'Nein'
        })
      }
      return items
    },
    async load() {
      const url = this.api + 'tickets'
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