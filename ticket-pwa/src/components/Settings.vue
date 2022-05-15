<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <center>
      <v-btn
        class="mb-3 mt-n2 glas"
        text
        dark
        width="800px" 
        height="45px"
        max-width="90%"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-cog</v-icon> Einstellungen
      </v-btn>
      </center>
    </template>
    <v-card>
      <v-toolbar
        dark
      >
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Einstellungen</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card 
        class="ma-5"
        elevation="0"
      >
        <v-card-title>
          Modus:
        </v-card-title>
        <v-select
          v-model="settings.mode"
          class="ma-2"
          :items="modes"
          label="Solo field"
          solo
          width="80%"
        ></v-select>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Settings',
  props: {
    value: {
      type: Object,
      default: {
        mode: ''
      },
      required: true
    }
  },
  data: () => ({
    dialog: false,
    settings: {},
    modes: [
      'activate',
      'checkin'
    ]
  }),
  watch: {
    dialog(newValue,oldValue){
      if (newValue === true) {
        this.settings = this.value
      }
    }
  }
}
</script>

<style scoped>
.btn{
  bottom: 75px;
  right: 5px;
}
</style>