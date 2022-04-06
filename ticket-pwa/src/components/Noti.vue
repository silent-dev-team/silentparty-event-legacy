<template>
  <div>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      color="success"
      top
      >
      {{ snackbar.text }}
    </v-snackbar>
    <div class="text-center">
      <v-dialog
        v-model="noti.show"
        width="500"
        transition="dialog-top-transition"
        persistent
      >
        <v-card :color="noti.type">
          <v-card-title >
            {{noti.type}}
          </v-card-title>
          <v-card-text>
            {{noti.message}}
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            text
            @click="reset_noti()"
          >
            schließen
          </v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Noti',

    props: ['noti','snackbar','reset_noti']
  
  })
</script>

<style scoped>

</style>