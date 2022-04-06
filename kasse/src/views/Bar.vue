<template>
  <v-container>
    <div v-for="item in items" :key="item.id">
      <BarCard class="mx-auto my-5" :id="item.id"/>
    </div>
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