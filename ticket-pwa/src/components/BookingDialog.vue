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
      <v-card-actions>
        <v-btn
          color="white"
          text
          @click="$emit('book', id)"
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
      required: true
    },
  },

}
</script>

<style>

</style>