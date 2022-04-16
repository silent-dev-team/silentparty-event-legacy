<template>
  <div style="min-height: 100vh;">
    <v-btn 
      class="mx-auto" 
      width="100%"
      height="60px"
      :disabled="order.length == 0"
      @click="clearOrder()"
      color="error"
    >
      <v-icon>mdi-delete-sweep</v-icon>
    </v-btn>
    <v-simple-table class="mx-1">
      <template v-slot:default>
        <thead>
          <tr >
            <th class="text-left">
              Produkt
            </th>
            <th class="text-right">
              Anzahl
            </th>
            <th class="text-right">
              Preis
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="o in order"
            :key="o.name"
            @dblclick="dblclick(o.id)"
          >
            <td class="text-left">
              {{ o.name }}
            </td>
            <td class="text-right">
              {{ o.number }}
            </td>
            <td class="text-right">
              {{ fix(o.sum) }}€
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div style="height: 100px;" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'OrderList',

  data() {
    return {}
  },
  computed: {
    ...mapState([
      'order'
    ]),
    ...mapGetters([
      'sum'
    ]),
  },
  methods: {
    ...mapMutations([
      'clearOrder',
      'delPosFromOrder'
    ]),
    fix(str){
      return parseFloat(str).toFixed(2)
    },
    dblclick(id){
      console.log(id)
      this.delPosFromOrder(id)
    }
  },
}

</script>

<style>

</style>