<template>
  <div id="app">
    <ModalComponent v-if="!pseudo" @savePseudo="setPseudo" />
    <div v-if="pseudo" class="main-layout">
      <TabComponent :tabs="tabs">
        <template #tab-0>
          <CanvasComponent :ws="ws" :pixelSize="10" />
        </template>
        <template #tab-1>
          <ChatComponent :ws="ws" :user="pseudo" />
        </template>
        <template #tab-2>
          <div>
            <h2>Statistiques</h2>
            <p>Contenu des statistiques ici...</p>
          </div>
        </template>
      </TabComponent>
    </div>
  </div>
</template>

<script>
import { ColorPicker } from 'vue-accessible-color-picker'
import { Socket } from './socket';

export default {
  components: { CanvasComponent, ChatComponent, ModalComponent, TabComponent },
  data() {
    return {
      ws: null,
      pseudo: null,
      temporaryPseudo: null,
      status: "edit",
      color: "#f80b",
      pos: { x: null, y: null },
      ctx: null
    }
  },
  mounted() {
    this.ws = new Socket();
    const ctx = document.getElementById("canvas").getContext('2d');
    this.ctx = ctx;

    this.ws.onmessage = (event) => {
      const { action, data } = JSON.parse(event.data)
      if (action == 'draw') {
        ctx.fillStyle = data.color;
        ctx.fillRect(data.x, data.y, this.pixel, this.pixel);
      } else if (action == "msg") {
        this.messages.push(data)
      } else if (action == "init") {
        data.forEach(savePixel => {
          ctx.fillStyle = savePixel.color;
          ctx.fillRect(savePixel.x, savePixel.y, this.pixel, this.pixel);
        });
      }
    }
    this.ws.connect()
  },
  methods: {
    setPseudo(pseudo) {
      this.pseudo = pseudo;
    },
  },
  mounted() {
    this.ws = new WebSocket("ws://localhost:5000");

    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: 5000 });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const data = JSON.parse(message);

        // Broadcast à tous les clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      });
    });

    console.log("Serveur WebSocket démarré sur ws://localhost:5000");

    this.ws.send(JSON.stringify(data))
  },
  send() {
    if (this.pseudo && this.message) {
      this.ws.send(JSON.stringify({ action: "msg", data: { content: this.message, author: this.pseudo, type: 1 } }))
      this.message = ""
    }
  },
  savePseudo() {
    this.pseudo = this.temporaryPseudo

    this.ws.send(JSON.stringify({ action: "join", data: { pseudo: this.pseudo } }))
  },
  setStatus(status) {
    this.status = status
  },
  mouseMove(event) {
    const rect = event.target.getBoundingClientRect();
    this.pos.x = Math.floor((event.clientX - rect.left) / this.pixel) * this.pixel + 1
    this.pos.y = Math.floor((event.clientY - rect.top) / this.pixel) * this.pixel + 1
  }
}

</script>

<style>
.main-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
