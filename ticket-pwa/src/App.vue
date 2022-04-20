<template>
  <v-app>
    <v-main>
      <PingBtn :value="apiPing" @click="refetch()" />
      <EntrySign :value="!entry" @click="refetch()"/>
      <HistoryBtn v-model="history" />
      <div class="qr">
        <qrcode-stream @decode="onDecode" :camera="camera"></qrcode-stream>
      </div>
      <Noti v-model="noti.show" @close="turnCameraOn()" :type="noti.type" :color="noti.color" :message="noti.message" />
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
import PingBtn from './components/PingBtn.vue'
import HistoryBtn from './components/HistoryBtn.vue'
import EntrySign from './components/EntrySign.vue'
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
    ServerHistory,
    PingBtn,
    HistoryBtn,
    EntrySign
  },

  data: () => ({
    apiUrl: 'https://api.sp/',//'http:localhost:5000/',
    camera: 'auto',
    scans: [] as Scan[],
    apiPing: false,
    entry: true,
    eventSource: new EventSource('http:localhost:5000/stream'),//'https://sp/stream'),
    refetchRate: 10,
    history: false,
    noti: {
      show: false,
      message: "",
      color: "",
      type: ""
    },
  }),
  computed: {
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
    notify (message:string, type:string='snackbar', color:string='success') {
      this.noti.message = message
      this.noti.type = type
      this.noti.color = color
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
        color:"",
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
        this.notify(message,'dialog','error')
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
    async onDecode (input:string) {
      if (!this.apiPing) {
        this.notify('API nicht erreichbar... \n' + input, 'dialog', 'error')
        this.turnCameraOff()
        this.turnCameraOn()
        return 1
      }
      const inputs = input.split(';')
      const id = inputs[0]
      const hash = inputs[1]
      this.refetch()
      this.turnCameraOff()
      const r = await this.checkin(id)
      console.log(r)
      if (!r.valid) {
        const message = id + ' ist nicht im System'
        this.writeHistory(id, 'invalide')
        this.notify(message,'dialog','error')
        return 1
      }
      var checkin: boolean = !r.data.checked
      if (!checkin) {
        const message = id + ' ist bereits um ' + r.data.time + ' eingecheckt...'
        this.writeHistory(id, 'rescan')
        this.notify(message,'dialog','error')
        return 1
      }
      this.notify(id + ' eingecheckt','snackbar','success')
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
    ping(){
      const URL = this.apiUrl + 'ping'
      console.log(URL)
      fetch(URL)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          this.apiPing = data.ping
        }).catch(err => {
          console.log(err)
          this.apiPing = false
        })
    },
    async fetch_entry(){
      const URL = this.apiUrl + 'entry'
      const response = await fetch(URL)
      const r = await response.json()
      this.entry = r.entry
    },
    refetch(){
      this.ping()
      this.fetch_entry()
    }
  },
  mounted() {
    if (localStorage.scans) {
      this.scans = JSON.parse(localStorage.scans)
    }
    this.refetch()
    const interval = setInterval(() => {
        this.refetch()
      }, this.refetchRate*1000
    )
    var that = this
    this.eventSource.addEventListener('entry', function(event:any) {
        var data = JSON.parse(event.data)
        that.entry = data.entry
    }.bind(that), false)
  },
  watch: {
    scans() {
      localStorage.scans = JSON.stringify(this.scans)
    }
  }
});
</script>


<style>
.qr {
  position: fixed;
  height: 100vh;
  width:100%;
}
.btn{
  position: fixed;
  z-index: 5;
}
.pulse {
  display: block;
  cursor: pointer;
  animation: pulse 1s infinite;
}
.pulse:hover {
  animation: none;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(204, 44, 44, 0.4);
  }
  70% {
    -webkit-box-shadow: 0 0 0 40px rgba(204, 44, 44, 0);
  }
  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(204, 44, 44, 0);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 44, 44, 0.4);
    box-shadow: 0 0 0 0 rgba(204, 44, 44, 0.4);
  }
  70% {
    -moz-box-shadow: 0 0 0 40px rgba(204, 44, 44, 0);
    box-shadow: 0 0 0 40px rgba(204, 44, 44, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 44, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 44, 44, 0);
  }
}

</style>