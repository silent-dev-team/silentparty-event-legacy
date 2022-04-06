<template>
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
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'ServerHistory',
    props: ['value','apiUrl'],
    data: () => ({
      search: '',
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
          text: 'Status',
          value: 'status',
          sortable: true
        }
      ],
      items: [
        {
          id: '1',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '2',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '3',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '4',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '5',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '6',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '7',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '8',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '9',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '10',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '11',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '12',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '13',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
        {
          id: '14',
          time: '2019-01-01 12:00:00',
          status: 'OK'
        },
      ]
    }),
    methods: {
      close() {
        this.$emit('input', false)
      },
      async loadHistory() {
        const url = this.apiUrl + '/tickets'
        const response = await fetch(url)
        const data = await response.json()
        console.log('data', data)
        //this.items = data
      }
    },
    mounted() {
      console.log('ServerHistory mounted')
      this.loadHistory()
    },
  })
</script>

<style>

</style>