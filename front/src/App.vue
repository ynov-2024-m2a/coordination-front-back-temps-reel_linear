<template>
  <div id="app" v-if="ws">
    <ModalComponent v-if="!pseudo" @savePseudo="setPseudo" />
    <div v-else class="main-layout">
      <TabComponent :tabs="tabs" @changeTab="selectTab" />
      <CanvasComponent :ws="ws" :pixels="pixels" :messages="messages" :user="pseudo" />
    </div>
  </div>
</template>

<script>
import CanvasComponent from './components/Canvas.vue';
import ModalComponent from './components/Modal.vue';
import TabComponent from './components/Tab.vue';
import { Socket } from './socket';


export default {
  components: { CanvasComponent, ModalComponent, TabComponent },
  data() {
    return {
      ws: null,
      pseudo: null,
      technologie: 'websocket',
      messages: [],
      pixels: [],
      tabs: [
        { label: "Websockets", value: "websocket" },
        { label: "Long polling", value: "longPolling" },
        { label: "Mercure", value: "mercure" },
      ],
    };
  },
  mounted() {
    this.createWebsocket()
  },
  methods: {
    createWebsocket () {
      console.log('pass');
      
      this.ws = new Socket(this.technologie);
      this.ws.onmessage = (event) => {
        const { action, data } = JSON.parse(event.data)
        if (action == 'draw') {
          this.pixels = [...this.pixels, data];
        } else if (action == "msg") {
          this.messages.push(data)
        } else if (action == "init") {
          this.pixels = data
        }
      }
      this.ws.connect()
    },
    setPseudo(pseudo) {
      this.pseudo = pseudo;
    },
    selectTab(tab) {
      this.technologie = tab
      this.createWebsocket()
    }
  }
};
</script>

<style>
.main-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
