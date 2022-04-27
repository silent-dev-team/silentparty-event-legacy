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
        <p style="font-size: 20px;">Gutschein wird einglöst und verbucht.</p>
      </v-card-text> 
      <v-card-actions
        class="justify-space-around"
      >
        <v-btn
          color="white"
          text
          @click="$emit('booking')"
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
    }
  },

}
</script>

<style>

</style>