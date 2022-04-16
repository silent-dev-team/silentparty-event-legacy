<template>
  <v-container>
    <v-row>
      <v-col 
        v-for="item in items" :key="item.id"
        xs="12" sm="6" md="4" lg="3" xl="2"
      >
      <div class="mx-auto my-3">
        <Badge :id="item.id">
          <BarCard :id="item.id"/>
        </Badge>
      </div>
      </v-col>
    </v-row>
    <div height="200px"></div>
  </v-container>
</template>

<script>
import BarCard from '@/components/BarCard.vue'
import Badge from '@/components/Badge.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Bar',
  components: {
    BarCard,
    Badge
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