<template>
  <v-app>
    <v-main>
      <center>
        <div class="mode-box glas" width="200px">
          <h1>{{modus_text}}</h1>
        </div>
      </center>
      <PingBtn :value="apiPing" @click="refetch()" />
      <EntrySign v-if="!entry_control" :api="api" :stream="stream" @click="refetch()"/>
      <EntryBtn v-if="entry_control" :api="api" :stream="stream" />
      <AllTickets :api="api" />
      <BookingDialog v-model="current_ticket.value" :id="current_ticket.id" :api="api" @booking="patch()" />
      <div class="qr">
        <qrcode-stream @decode="onDecode" :camera="camera"></qrcode-stream>
      </div>
      <Noti v-model="noti.show" @close="turnCameraOn()" :type="noti.type" :color="noti.color" :message="noti.message" />
      <LocalTable :items="scans" />
      <Settings v-model="settings" />
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue';
import LocalTable from './components/LocalTable.vue'
import Noti from './components/Noti.vue'
import PingBtn from './components/PingBtn.vue'
import AllTickets from './components/AllTickets.vue'
import EntrySign from './components/EntrySign.vue'
import EntryBtn from './components/EntryBtn.vue'
import BookingDialog from './components/BookingDialog.vue'
import Settings from './components/Settings.vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { sha256, sha224 } from 'js-sha256';

export default Vue.extend({
  name: 'App',

  components: {
    QrcodeStream,
    LocalTable,
    Noti,
    PingBtn,
    AllTickets,
    EntrySign,
    EntryBtn,
    BookingDialog,
    Settings
  },

  data: () => ({
    // MODUS: 'activate', // 'activate' or 'checkin'
    settings:{},
    salt:"dieVorVorLetzteSilentParty",
    api: 'http://localhost:5000/',//{{'http://localhost:5000/', //'https://api.sp/',
    stream: 'https://sp/stream',
    camera: 'auto',
    scans: [],
    apiPing: false,
    refetchRate: 10,
    alltickets: false,
    current_ticket: {
      value: false,
      id: '',
      hash: '', // hash of the ticket
    }, 
    noti: {
      show: false,
      message: "",
      color: "",
      type: ""
    },
    errorStati: {
      500: {
        message:"Serverfehler",
        log: null
      },
      404: {
        message:"Ticket nicht in Datenbank",
        log: 'not found'
      },
      400: {
        message:"Code nicht zulässig",
        log: 'not valid'
      },
      206: {
        message:'Aktion bereits geschehen',
        log: null
      },
    }
  }),
  computed: {
    MODUS(){
      return this.settings.mode
    },
    entry_control(){
      return this.MODUS == 'activate'
    },
    modus_text(){
      if(this.settings.mode == 'activate'){
        return 'Aktiviertung'
      } else if(this.settings.mode == 'checkin'){
        return 'Einchecken'
      } else {
        return 'Kein Modus'
      }
    }
  },
  methods: {
    now() {
      function addZero(i) {
        var s = String(i) 
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
    Sleep(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    },
    notify (message, type='snackbar', color='success') {
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
    toHexString(string) {
      let ar = [];
        for(let c of string){
            ar.push( c.charCodeAt(0) );
        }
        return ar;
    },
    validateQrString(qr_string){
      const pair = qr_string.split(";");
      let utf8Encode = new TextEncoder();
      if(pair.length != 2) return false;
      let binarys = null
      try {
        binarys = atob(pair[1]);
      } catch (error) {
          return false;
      }
      const hexNr = sha256(utf8Encode.encode(pair[0]+this.salt));
      const ar = [];
      for(let i = 0; i< hexNr.length;i+=2 ){
        ar.push(Number("0x"+hexNr.slice(i,i+2)));
      }
      return JSON.stringify(ar) === JSON.stringify(this.toHexString(binarys));
    },
    async check_qr(qr_string) {
      if (this.MODUS !== 'checkin' && this.MODUS !== 'activate') {
        this.notify('Modus nicht gefunden', 'snackbar', 'error')
        return
      }
      const pair = qr_string.split(";")
      const id = pair[0]
      const hash = pair[1]
      const data = { hash:hash }
      const URL = this.api + 'tickets/' + id + '/' + this.MODUS
      const response = await fetch(URL+'?'+ new URLSearchParams(data))
      if (response.status in this.errorStati) {
        const error = this.errorStati[response.status]
        error.log ? this.writeLog(id, error.log) : null
        this.notify(error.message, 'dialog', 'error')
        return
      }
      const r = await response.json()
      console.log(r)
      if (r.data.activeted === "0" && this.MODUS === 'checkin') {
        const message = id + ' ist nicht aktiviert'
        this.writeLog(id, 'not active')
        this.notify(message,'dialog','error')
        return 1
      }
      if (r.data.activeted === "1" && this.MODUS === 'activate') {
        const message = id + ' bereits aktiviert'
        this.writeLog(id, 'bereits aktiviert')
        this.notify(message,'snackbar','error')
        return 1
      }
      if (r.data.checked === "1" && this.MODUS === 'checkin') {
        const message = id + ' ist bereits um ' + r.data.checkin_time.slice(11, 19) + ' eingecheckt...'
        this.writeLog(id, 'rescan')
        this.notify(message,'dialog','error')
        return 1
      }
      this.current_ticket.id = id
      this.current_ticket.hash = hash
      if (this.MODUS === 'checkin') {
        this.patch()
        return r
      }
      this.current_ticket.value = true
      return r
    },
    async patch() {
      if (this.MODUS !== 'checkin' && this.MODUS !== 'activate') {
        this.notify('Modus nicht gefunden', 'snackbar', 'error')
        return
      }
      const id = this.current_ticket.id
      const hash = this.current_ticket.hash
      const data = { hash:hash }
      const URL = this.api + 'tickets/' + id + '/' + this.MODUS
      const response = await fetch(URL, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (response.status in this.errorStati) {
        const error = this.errorStati[response.status]
        error.log ? this.writeLog(id, error.log) : null
        this.notify(error.message, 'dialog', 'error')
        return
      }
      const r = await response.json()
      if (r.data.activeted === "0" && this.MODUS === 'checkin') {
        const message = id + ' ist nicht aktiviert'
        this.writeLog(id, 'not active')
        this.notify(message,'dialog','error')
        return 1
      }
      if (r.data.checked === "1") {
        const message = id + ' ist bereits um ' + r.data.checkin_time.slice(11, 19) + ' eingecheckt...'
        this.writeLog(id, 'rescan')
        this.notify(message,'dialog','error')
        return 1
      }
      if (this.MODUS === 'checkin'){
        const message = id+' wurde eingecheckt'
        this.writeLog(id, 'checkin')
        this.notify(message, 'snackbar', 'success')
      } else if (this.MODUS === 'activate'){
        const message = id+' wurde aktiviert'
        this.writeLog(id, 'aktiviert')
        this.notify(message,'snackbar','success')
      } else {
        this.notify('Modusfehler','snackbar','error')
      }
      this.current_ticket.id = ''
      this.current_ticket.hash = ''
      this.current_ticket.value = false
      return r
    },
    writeLog(id, status){
      let scan = {}
      scan.id = id
      scan.time = this.now()
      scan.timestamp = new Date().getTime()
      scan.status = status
      this.scans.push(scan)
    },
    async onDecode (qr_string) {
      this.turnCameraOff()
      const valid = this.validateQrString(qr_string)
      if (!valid){
        this.notify('Ticket nicht valide \n' + qr_string, 'dialog', 'error')
        return 1
      }
      const pair = qr_string.split(';')
      const id = pair[0]
      const hash = pair[1]
      if (!this.apiPing) {
        this.writeLog(id, 'offline val')
        this.notify('API nicht erreichbar... \nAber Ticket ist valide!', 'dialog', 'grey')
        this.Sleep(1000)
        this.turnCameraOn()
        return 1
      }
      this.refetch()
      this.turnCameraOff()
      await this.check_qr(qr_string)
      this.Sleep(1000)
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
      const URL = this.api + 'ping'
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
    refetch(){
      this.ping()
    }
  },
  mounted() {
    console.log('mounted')
    this.refetch()
    if (localStorage.scans) {
      console.log('load scans')
      this.scans = JSON.parse(localStorage.scans)
    }
    if (localStorage.settings) {
      console.log('load settings')
      this.settings = JSON.parse(localStorage.settings)
    }
    const interval = setInterval(() => {
        this.refetch()
      }, this.refetchRate*1000
    )
  },
  watch: {
    scans() {
      localStorage.scans = JSON.stringify(this.scans)
      console.log('save scans')
    },
    "settings.mode":function(){
      localStorage.settings = JSON.stringify(this.settings)
      console.log('save settings')
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
  top: 5px;
}

@media only screen and (max-width: 480px) {
  .btn{
    top: 100px;
  }
}

.pulse {
  display: block;
  cursor: pointer;
  animation: pulse 1s infinite;
}
.pulse:hover {
  animation: none;
}

.mode-box {
  position: fixed;
  z-index: 11;
  left: 50%;
  transform: translate(-50%);
  top: 10px;
  width: 300px;
}

.glas{
  color: white;
  padding: 17px;
  border-radius: 7px;
  -moz-box-shadow: 5px 7px 5px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 5px 7px 5px rgba(0, 0, 0, 0.3);
  box-shadow: 5px 7px 5px rgba(0, 0, 0, 0.3);
  background: rgba(37, 37, 37, 0.3);
  backdrop-filter: blur(2px);
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