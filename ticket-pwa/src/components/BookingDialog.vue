<template>
  <v-dialog
    v-model="value"
    width="500"
    transition="dialog-top-transition"
    persistent
  >
    <v-card
      color="success"
    >
      <v-card-title >
        Einlösen
      </v-card-title>
      <v-card-text>
        <p style="font-size: 20px;">Gutschein {{id}} wird einglöst und verbucht.</p>
        <p>Dabei werden {{shopItem.price}}€ gebucht.</p>
      </v-card-text> 
      <v-card-actions
        class="justify-space-around"
      >
        <v-btn
          color="white"
          text
          @click="book()"
        >
          Buchen
        </v-btn>
        <v-btn
          color="white"
          text
          @click="$emit('input', false)"
        >
          Abbrechen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BookingDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    api: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    shopItem_route: 'shopItems',
    shopItemId: 11,
    shopItem: {},
    postOrder_route: 'orders'
  }),
  methods: {
    async get_shopItem() {
      const r = await (await fetch(this.api+this.shopItem_route)).json()
      const items = r.data
      return items.find(item => item.id == this.shopItemId)
    },
    async postOrder(data) {
      const response = await fetch(this.api+this.postOrder_route,
          {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(data)
          }
        )
      const r = await response.json()
      return r
    },
    async book(){
      if (this.shopItemId != this.shopItem.id) {
        console.log('Items nicht geladen...')
      }
      const shopItem = this.shopItem
      let item = {
        id: shopItem.id,
        name: shopItem.name,
        price: shopItem.price,
        number: 1,
        sum: shopItem.price
      }
      const data = {
        items: [item],
        sum: item.sum,
      }
      console.log(data)
      const response = await this.postOrder(data)
      if (response.success) {
        this.$emit('booking')
      }
    }
  },
  async mounted() {
    this.shopItem = await this.get_shopItem()
  }
}
</script>

<style>

</style>