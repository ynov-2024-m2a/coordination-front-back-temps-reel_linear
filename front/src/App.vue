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
import CanvasComponent from './components/Canvas.vue';
import ChatComponent from './components/Chat.vue';
import ModalComponent from './components/Modal.vue';
import TabComponent from './components/Tab.vue';

export default {
  components: { CanvasComponent, ChatComponent, ModalComponent, TabComponent },
  data() {
    return {
      ws: null,
      pseudo: null,
      tabs: [
        { label: "Dessin" },
        { label: "Chat" },
        { label: "Statistiques" },
      ],
    };
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

  },
};
</script>

<style>
.main-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
