<template>
  <v-app>
    <v-main>
      <v-btn 
        class="btn ma-2"
        style="top: 5px; left: 5px;"
        :color="apiPing ? 'green' : 'red'"
        fab
        dark
        @click="ping()"
      >
        <v-icon
          large
        >mdi-access-point</v-icon>
      </v-btn>
      <v-btn 
        class="btn ma-2"
        style="top: 5px; right: 5px;"
        fab
        :dark="history"
        @click="history = !history"
      >
        <v-icon
          large
        >mdi-history</v-icon>
      </v-btn>
      <div class="qr">
        <qrcode-stream @decode="onDecode" :camera="camera"></qrcode-stream>
      </div>
      <Noti :noti="noti" :snackbar="snackbar" :reset_noti="reset_noti" />
      <LocalTable :items="scans" />
      <ServerHistory v-model="history" v-if="history" :apiUrl="apiUrl"/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import LocalTable from './components/LocalTable.vue'
import Noti from './components/Noti.vue'
import ServerHistory from './components/ServerHistory.vue'
import { QrcodeStream } from 'vue-qrcode-reader'

export interface Scan {
   id: string;
   time: string;
   timestamp: number;
   status: string;
}

export default Vue.extend({
  name: 'App',

  components: {
    QrcodeStream,
    LocalTable,
    Noti,
    ServerHistory
  },

  data: () => ({
    camera: 'auto',
    scans: [] as Scan[],
    apiPing: false,
    history: false,
    snackbar: {
      show: false,
      text: 'Karte eingecheckt',
      timeout: 5000
    },
    noti: {
      show: false,
      message: "",
      type: ""
    }
  }),
  computed:{
    apiUrl () {
      var getUrl = window.location
      var apiUrl = getUrl .protocol + "//" + getUrl.host + "/" + 'api/'
      //return apiUrl
      return 'http://127.0.0.1:443/api/'
    }
  },
  methods: {
    now() {
      function addZero(i:number) {
        var s:string = String(i) 
        if (i < 10) {
          s = "0" + s
        }
        return s;
      }
      var now = new Date()
      var h = addZero(now.getHours())
      var m = addZero(now.getMinutes())
      var s = addZero(now.getSeconds())
      var time = h+':'+m+':'+s
      return time
    },
    Sleep(milliseconds:number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    },
    notify (message:string, success:boolean=true) {
      this.noti.message = message
      this.noti.type = success? "success" : 'error'
      this.noti.show = true
    },
    async reset_noti () {
      this.turnCameraOn()
      await this.Sleep(100)
      this.noti.show = false
      await this.Sleep(1000)
      this.noti = {
        show: false,
        message: "",
        type: ""
      }
    },
    async checkin(id:string) {
      const URL = this.apiUrl + 'tickets/' + id
      const data = {"checkin": true}
      const response = await fetch(URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (response.status === 405) {
        const message = 'Code nicht zulässig!!'
        this.writeHistory(id, 'invalide')
        this.notify(message,false)
        return 
      }
      const r = await response.json()
      return r
    },
    writeHistory(id:string, status:string){
      let scan = {} as Scan
      scan.id = id
      scan.time = this.now()
      scan.timestamp = new Date().getTime()
      scan.status = status
      this.scans.push(scan)
    },
    async onDecode (id:string) {
      this.ping()
      this.turnCameraOff()
      const r = await this.checkin(id)
      console.log(r)
      if (!r.valid) {
        const message = id + ' ist nicht im System'
        this.writeHistory(id, 'invalide')
        this.notify(message,false)
        return 1
      }
      var checkin: boolean = !r.data.checked
      if (!checkin) {
        const message = id + ' ist bereits um ' + r.data.time + ' eingecheckt...'
        this.writeHistory(id, 'rescan')
        this.notify(message,false)
        return 1
      }
      this.snackbar.text = id + ' wurde eingecheckt'
      this.snackbar.show = true
      this.writeHistory(id, 'ok')
      this.turnCameraOn()
      return 0
    },
    turnCameraOn () {
      this.camera = 'auto'
    },
    turnCameraOff () {
      this.camera = 'off'
    },
    async ping(){
      const URL = this.apiUrl + 'ping'
      this.apiPing = false
      const response = await fetch(URL)
      const r = await response.json()
      this.apiPing = r.ping || false
    }
  },
  mounted() {
    if (localStorage.scans) {
      this.scans = JSON.parse(localStorage.scans)
    }
    this.ping()
  },
  watch: {
    scans() {
      localStorage.scans = JSON.stringify(this.scans)
    }
  }
});
</script>


<style scoped>
.qr {
  position: fixed;
  height: 100vh;
  width:100%;
}
.btn{
  position: fixed;
  z-index: 5;
}
</style>