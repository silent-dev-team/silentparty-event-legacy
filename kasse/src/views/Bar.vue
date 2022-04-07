<template>
  <v-container>
    <v-row>
      <v-col 
        v-for="item in items" :key="item.id"
        xs="12" sm="6" md="4" lg="3" xl="2"
      >
        <BarCard class="ma-auto" :id="item.id"/>
      </v-col>
    </v-row>
    <div height="200px"></div>
  </v-container>
</template>

<script>
import BarCard from '@/components/BarCard.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Bar',
  components: {
    BarCard
  },
  computed: {
    ...mapState([
      'items'
    ]),
  },
  methods: {
  },
  mounted(){
    console.log(this.items)
  }

}
</script>

<style>

</style>