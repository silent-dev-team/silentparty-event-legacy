<template>
  <div>
    <v-snackbar
      v-if="snackbar"
      :value="value"
      @input="close()"
      :timeout="timeout"
      color="success"
      top
    >
      {{ message }}
    </v-snackbar>
    <div class="text-center">
      <v-dialog
        v-if="dialog"
        v-model="value"
        width="500"
        transition="dialog-top-transition"
        persistent
      >
        <v-card :color="color">
          <v-card-title >
            Achtung
          </v-card-title>
          <v-card-text>
            {{message}}
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            text
            @click="close()"
          >
            schließen
          </v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Noti',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'snackbar' // snackbar, dialog
      },
      color: {
        type: String,
        default: 'success' // success, error
      },
      timeout: {
        type: Number,
        default: 5000
      }
    },
    computed: {
      dialog(){
        return this.type === 'dialog'
      },
      snackbar(){
        return this.type === 'snackbar'
      }
    },
    methods: {
      close(){
        if (this.dialog) {
          this.$emit('close')
        }
        this.$emit('input', false)
      }
    }
  })
</script>

<style scoped>

</style>