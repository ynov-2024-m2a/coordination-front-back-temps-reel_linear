<template>
  <div class="canvas-container">
    <ButtonComponent
      @onModeChange="changeMode"
      @onColorChange="changeColor"
    />
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
      @mousedown="startDrawing"
      @mousemove="handleDraw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
    ></canvas>
  </div>
</template>

<script>
import ButtonComponent from './ButtonAction.vue';

export default {
  name:"CanvasComponent",
  components: { ButtonComponent },
  props: {
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 },
    pixelSize: { type: Number, default: 10 },
    ws: { type: Object, required: true },
  },
  data() {
    return {
      isDrawing: false,
      color: '#000000', // Couleur initiale
      mode: 'edit', // Modes : 'edit' ou 'erase'
    };
  },
  methods: {
    startDrawing(event) {
      this.isDrawing = true;
      this.handleDraw(event);
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    handleDraw(event) {
      if (!this.isDrawing) return;

      const rect = this.$refs.canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / this.pixelSize);
      const y = Math.floor((event.clientY - rect.top) / this.pixelSize);

      const ctx = this.$refs.canvas.getContext('2d');

      if (this.mode === 'edit') {
        ctx.fillStyle = this.color;
        ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
      } else if (this.mode === 'erase') {
        ctx.clearRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
      }

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            action: this.mode === 'edit' ? 'draw' : 'erase',
            x,
            y,
            color: this.color,
          })
        );
      }
    },
    changeMode(newMode) {
      this.mode = newMode;
    },
    changeColor(newColor) {
      this.color = newColor;
    },
    updateCanvas({ x, y, color }) {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    },
    erasePixel({ x, y }) {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.clearRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    },
  },
  mounted() {
    this.wsClient.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.action === 'draw') {
        this.updateCanvas(message);
      } else if (message.action === 'erase') {
        this.erasePixel(message);
      }
    };
  },
};
</script>

<style scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
canvas {
  border: 1px solid #ccc;
  cursor: crosshair;
}
</style>
