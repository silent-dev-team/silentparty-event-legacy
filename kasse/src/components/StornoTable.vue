<template>
  <v-card class="my-5 mx-auto" max-width="800px">
    <v-data-table
      :headers="headers"
      :items="orders"
      show-expand
      single-expand
      @click:row="expand"
    >
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
      <v-card class="mt-1 mb-3 mx-auto" max-width="600px">
        <v-card-title>
          <span class="headline">{{item.id}}</span>
          <v-spacer></v-spacer>
          <v-dialog width="300px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                v-bind="attrs"
                v-on="on" 
                color="red" 
                dark>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="d-flex justify-space-around">
                <span class="headline">Wirklich löschen?</span>
              </v-card-title>
              <v-card-actions class="pb-5 d-flex justify-space-around">
                <v-btn color="red" dark @click="deleteOrder(item.id)">
                  <v-icon>Löschen</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Getränk
                </th>
                <th class="text-left">
                  Anzahl
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="i in item.items"
                :key="i.name"
              >
                <td>{{ i.name }}</td>
                <td>{{ i.number }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
      </td>
    </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: "StornoTable",
  data() {
    return {
      route: '/orders',
      orders: [],
      headers: [
        { text: 'Positionen', value: 'items_str' },
        { text: 'Summe', value: 'sum' },
        { text: 'Zeitpunkt', value: 'timestamp' },
      ]
    }
  },
  computed: {
    ...mapState([
      'api'
    ]),
  },
  methods: {
    fetchOrders() {
      const data =  fetch(this.api+this.route)
        .then(r => r.json())
        .then(data => data.data)
      return data
    },
    transform(data) {
      return data.map(order => {
        return {
          id: order.id,
          items: order.items,
          items_str: order.items.map(item => item.name).join(', '),
          sum: order.sum+'€',
          timestamp: order.timestamp
        }
      })
    },
    deleteOrder(id) {
      fetch(this.api+this.route + '/' + id, {
          method: 'DELETE',
        })
        .then(res => res.json())
        .then(res => console.log(res))
      setTimeout(() => { this.load() }, 500);
    },
    load(){
      this.fetchOrders().then(orders => {
        this.orders = this.transform(orders)
      })}
  },
  mounted() {
    this.load()
  }
}
</script>

<style>

</style>