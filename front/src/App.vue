<template>
  <div class="h-screen flex w-full items-center bg-gray-800">
    <div class="h-screen w-1/5 bg-gray-700 border-r-2 border-blue-600">
      <div id="chat" class="text-white overflow-y-scroll" style="height: 90vh;">
        <div class="flex gap-2" v-for="(msg, index) in messages" :key="index">
          <template v-if="msg.type == 2">
            <div class="text-blue-300">{{ msg.author }} {{ msg.content }}</div>
          </template>
          <template v-else>
            <div class="font-semibold">{{ msg.author }}:</div>
            <div>{{ msg.content }}</div>
          </template>
        </div>
      </div>
      <div style="height: 10vh;" class="flex p-2 gap-2">
        <input type="text" v-model="message" @keypress.enter="send"
          class="w-full h-full border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="message">
        <button type="button" @click="send"
          class="p-2.5 text-white bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm text-center hover:bg-blue-700 focus:ring-blue-800">
          Envoyer
        </button>
      </div>
    </div>
    <div class="h-screen items-center flex justify-center ml-8 gap-8">
      <div class="flex flex-col items-center">
        <div v-if="pseudo" class="text-white text-2xl mb-8">{{ pseudo }}</div>
        <div class="relative">
          <canvas id="canvas" @mousemove="mouseMove" class="cursor-none border-2 border-blue-600 bg-white" width="800"
            height="500"></canvas>
          <div @click="draw" class="absolute cursor-none border border-black"
            :style="`background-color: ${status == 'erase' ? 'white' : color}; width: 10.5px; height: 10.5px; top: ${pos.y}px; left: ${pos.x}px;`">
          </div>
        </div>
      </div>

      <div>
        <div class="w-full flex justify-center items-center gap-4 mb-8">
          <img src="icon.png" />
          <div class="text-4xl font-semibold text-white">Pixel War</div>
        </div>
        <div class="flex text-white gap-2 my-2">
          <svg @click="setStatus('edit')"
            :class="'rounded bg-blue-600 p-2' + (status == 'edit' ? ' border-2 border-white' : '')" width="32" height="32"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M21.2635 2.29289C20.873 1.90237 20.2398 1.90237 19.8493 2.29289L18.9769 3.16525C17.8618 2.63254 16.4857 2.82801 15.5621 3.75165L4.95549 14.3582L10.6123 20.0151L21.2189 9.4085C22.1426 8.48486 22.338 7.1088 21.8053 5.99367L22.6777 5.12132C23.0682 4.7308 23.0682 4.09763 22.6777 3.70711L21.2635 2.29289ZM16.9955 10.8035L10.6123 17.1867L7.78392 14.3582L14.1671 7.9751L16.9955 10.8035ZM18.8138 8.98525L19.8047 7.99429C20.1953 7.60376 20.1953 6.9706 19.8047 6.58007L18.3905 5.16586C18 4.77534 17.3668 4.77534 16.9763 5.16586L15.9853 6.15683L18.8138 8.98525Z"
              fill="currentColor" />
            <path d="M2 22.9502L4.12171 15.1717L9.77817 20.8289L2 22.9502Z" fill="currentColor" />
          </svg>
          <svg @click="setStatus('erase')"
            :class="'rounded bg-blue-600 p-2' + (status == 'erase' ? ' border-2 border-white' : '')" width="32"
            height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M3.49997 12.8995C2.71892 13.6805 2.71892 14.9468 3.49997 15.7279L7.35785 19.5858H4.08576C3.53347 19.5858 3.08576 20.0335 3.08576 20.5858C3.08576 21.1381 3.53347 21.5858 4.08576 21.5858H20.0858C20.638 21.5858 21.0858 21.1381 21.0858 20.5858C21.0858 20.0335 20.638 19.5858 20.0858 19.5858H10.9558L20.4705 10.071C21.2516 9.28999 21.2516 8.02366 20.4705 7.24261L16.2279 2.99997C15.4468 2.21892 14.1805 2.21892 13.3995 2.99997L3.49997 12.8995ZM7.82579 11.4021L4.91418 14.3137L9.15683 18.5563L12.0684 15.6447L7.82579 11.4021ZM9.24 9.98787L13.4826 14.2305L19.0563 8.65683L14.8137 4.41418L9.24 9.98787Z"
              fill="currentColor" />
          </svg>
          <svg :class="'rounded bg-blue-600 p-2' + (status == 'takeColor' ? ' border-2 border-white' : '')"
            @click="setStatus('takeColor')" width="32" height="32" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.3847 2.87868C19.2132 1.70711 17.3137 1.70711 16.1421 2.87868L14.0202 5.00052L13.313 4.29332C12.9225 3.9028 12.2894 3.9028 11.8988 4.29332C11.5083 4.68385 11.5083 5.31701 11.8988 5.70754L17.5557 11.3644C17.9462 11.7549 18.5794 11.7549 18.9699 11.3644C19.3604 10.9739 19.3604 10.3407 18.9699 9.95018L18.2629 9.24316L20.3847 7.12132C21.5563 5.94975 21.5563 4.05025 20.3847 2.87868Z"
              fill="currentColor" />
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M11.9297 7.09116L4.1515 14.8693C3.22786 15.793 3.03239 17.169 3.5651 18.2842L1.99994 19.8493L3.41415 21.2635L4.97931 19.6984C6.09444 20.2311 7.4705 20.0356 8.39414 19.112L16.1723 11.3338L11.9297 7.09116ZM13.3439 11.3338L11.9297 9.91959L5.56571 16.2835C5.17518 16.6741 5.17518 17.3072 5.56571 17.6978C5.95623 18.0883 6.5894 18.0883 6.97992 17.6978L13.3439 11.3338Z"
              fill="currentColor" />
          </svg>
        </div>
        <ColorPicker :color="color" @color-change="(eventData) => this.color = eventData.cssColor" alpha-channel="hide"
          :visible-formats="['rgb']" />
      </div>
    </div>
  </div>

  <div id="modal" v-if="!pseudo" class="top-0 left-0 absolute w-full h-full bg-gray-600/75">
    <div class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-50 p-4">
      <div class="relative w-full max-w-md max-h-full">
        <div class="relative rounded-lg shadow bg-gray-700">
          <div class="px-6 py-6 lg:px-8">
            <h3 class="mb-4 text-xl font-medium text-white">Choisir un pseudo</h3>
            <div class="space-y-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-white">Pseudo</label>
                <input type="text" v-model="temporaryPseudo" @keypress.enter="savePseudo"
                  class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                  placeholder="pseudo" required>
              </div>
              <button type="button" @click="savePseudo"
                class="w-full text-white bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm text-center hover:bg-blue-700 focus:ring-blue-800 px-5 py-2.5">
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ColorPicker } from 'vue-accessible-color-picker'

export default {
  name: 'App',
  components: {
    ColorPicker,
  },
  data() {
    return {
      ws: null,
      pixel: 10,
      messages: [],
      message: null,
      pseudo: null,
      temporaryPseudo: null,
      status: "edit",
      color: "#f80b",
      pos: { x: null, y: null },
      ctx: null
    }
  },
  mounted() {
    this.ws = new WebSocket('ws://localhost:5000');
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
  },
  methods: {
    draw() {
      const x = this.pos.x - 1
      const y = this.pos.y - 1
      const id = `${x}${y}`

      if (this.status == 'takeColor') {
        const rgbToHex = (r, g, b) => {
          const componentToHex = (c) => {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
          }
          return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }
        const p = this.ctx.getImageData(x + this.pixel / 2, y + this.pixel / 2, 1, 1).data
        const hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        this.color = p[3] ? hex : 'white';
        return;
      }

      const color = this.status == "erase" ? "white" : this.color;
      const data = { action: "draw", data: { id, x, y, color } }

      if (this.ws.readyState == WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data))
      }
    },
    send() {
      if (this.ws.readyState == WebSocket.OPEN && this.pseudo && this.message) {
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
}
</script>
