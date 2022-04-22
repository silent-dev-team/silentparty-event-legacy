<template>
  <center>
    <div class="space"></div>
    <v-card width="800px" max-width="90%" class="ma-5" elevation="5" color="white">
      <v-text-field
        class="ma-3"
        v-model="search"
        type="number"
        append-icon="mdi-magnify"
        label="Suche"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        elevation="0"
        :items-per-page="5"
        :headers="headers"
        :items="items"
        :search="search"
        sort-by="time"
        :sort-desc="true"
        class="elevation-12"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getColor(item.status)"
            dark
          >
            {{ item.status }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </center>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'LocalTable',

    props: ['items'],

    data: () => ({
      search:'',
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
    }),
    methods: {
      getColor (status:string) {
        if (status === 'ok') return 'green'
        else if (status === 'rescan') return 'orange'
        else return 'red'
      },
    },
  })
</script>

<style scoped>
.space{
  height: 75vh;
}
</style>