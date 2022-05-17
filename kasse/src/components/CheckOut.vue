<template>
    <v-dialog
      v-model="value"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <OrderDrawer v-model="showOrder"/>
      <v-card justify="center">
        <v-toolbar
          style="z-index: 10;"
          dark
          color="teal darken-4"
        >
          <v-btn
            icon
            dark
            @click="close()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <h2>BEZAHLEN</h2>
          <v-spacer></v-spacer>
          
          <h1>{{sum}}€</h1>
        </v-toolbar>
        <center>
          <v-card width="300px" elevation="0">
              <v-row>
                <v-col class="text-right my-auto">Rück:</v-col>
                <v-col class="text-right my-auto">
                  <h1>{{fix(sum-cent)}}€</h1>
                </v-col>
                <v-col/>
              </v-row>
              <v-row>
                <v-col class="text-right my-auto">Kunde:</v-col>
                <v-col class="text-right my-auto">
                  <h1>{{fix(cent)}}€</h1>
                </v-col>
                <v-col/>
              </v-row>
          </v-card>
          <v-col
            v-for="m in 4"
            :key="m"
            cols="12"
            sm="6"
            class="py-2"
          >

            <v-item-group
              
              dense
              background-color="primary"
              dark
              multiple
            >
              <v-btn
                v-for="n in 3"
                :key="n"
                class="ma-1"
                fab
                width="110px"
                height="110px"
                @click="onKey(key(n,m))"
              >
                <h1>{{ key(n,m) }}</h1>
              </v-btn>
            </v-item-group>
            
          </v-col>
          <v-dialog width="300px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                v-bind="attrs"
                v-on="on" 
                class="mt-5" 
                :disabled="!ready"
                width="300px" 
                height="100px" 
                color="success"
              >
                
                <v-icon x-large>mdi-check</v-icon>
              </v-btn>
            </template>
              <v-btn height="100px" x-large color="success" dark @click="checkout()">
                <h1>Buchen</h1>
              </v-btn>
          </v-dialog>
        </center>
      </v-card>
    </v-dialog>
</template>

<style scoped>
</style>

<script>
import OrderDrawer from '@/components/OrderDrawer.vue'
import { mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'CheckOut',
  components: {
    OrderDrawer
  },

  props: [
    'value'
  ],
  data () {
    return {
      showOrder:false,
      display: '0',
      mapping : {
        '11': '7',
        '21': '8',
        '31': '9',
        '12': '4',
        '22': '5',
        '32': '6',
        '13': '1',
        '23': '2',
        '33': '3',
        '14': 'C',
        '24': '0',
        '34': '00',
      }
    }
  },
  computed: {
    ...mapGetters([
      'sum'
    ]),
    cent(){
      return this.display/100
    },
    ready() {
      return (this.sum > 0 && this.cent >= this.sum) || this.sum < 0
    }
  },
  methods: {
    ...mapActions([
      'postOrder',
      'fetch'
    ]),
    key(n,m){
      return this.mapping[n+''+m]
    },
    fix(str){
      return parseFloat(str).toFixed(2)
    },
    onKey(e){
      if(e === 'C'){
        this.display = '0'
      } else if(this.display === '0'){
        this.display = e
      } else {
        this.display += e
      }
    },
    checkout(){
      this.postOrder()
      setTimeout(() => this.fetch('items'),1000)
      this.display = '0'
      this.close()
    },
    close(){
      this.showOrder = false
      this.$emit('input', false)
    }
  }
}
</script>