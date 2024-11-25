<template>
  <div id="app" v-if="ws">
    <ModalComponent v-if="!pseudo" @savePseudo="setPseudo" />
    <div v-else class="main-layout">
      <TabComponent :tabs="tabs">
        <template #tab-0>
          <CanvasComponent :ws="ws" :pixels="pixels" />
        </template>
        <template #tab-1>
          <ChatComponent :ws="ws" :messages="messages" :user="pseudo" />
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
import { Socket } from './socket';


export default {
  components: { CanvasComponent, ChatComponent, ModalComponent, TabComponent },
  data() {
    return {
      ws: null,
      pseudo: null,
      messages: [],
      pixels: [],
      tabs: [
        { label: "Dessin" },
        { label: "Chat" },
        { label: "Statistiques" },
      ],
    };
  },
  mounted() {
    this.ws = new Socket();
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
  methods: {
    setPseudo(pseudo) {
      this.pseudo = pseudo;
    },
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
