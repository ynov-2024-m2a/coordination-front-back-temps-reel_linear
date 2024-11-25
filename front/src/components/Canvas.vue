<template>
  <div class="canvas-container">
    <div>
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
    <div>
      <ButtonAction
        @onModeChange="changeMode"
        @onColorChange="changeColor"
      />
    </div>
  </div>
</template>

<script>
import ButtonAction from './ButtonAction.vue';

export default {
  name:"CanvasComponent",
  components: { ButtonAction },
  props: {
    pixels: { type: Array, required: true },
    width: { type: Number, default: 1200 },
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
  mounted() {
    for (const pixel of this.pixels) {
      this.updateCanvas(pixel)
    }
  },
  watch: {
    pixels: {
      handler(newPixels, oldPixels) {
        const newPixel = newPixels.slice(oldPixels.length);
        for (const pixel of newPixel) {
          this.updateCanvas(pixel);
        }
      },
      deep: true,
    },
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
      const x = Math.floor((event.clientX - rect.left) / this.pixelSize) * this.pixelSize;
      const y = Math.floor((event.clientY - rect.top) / this.pixelSize) * this.pixelSize;

      this.draw(x, y)
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
      ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
    },
    erasePixel({ x, y }) {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.clearRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    },
    draw(x, y) {
      const ctx = this.$refs.canvas.getContext('2d');

      if (this.mode === 'edit') {
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
      } else if (this.mode === 'erase') {
        ctx.clearRect(x, y, this.pixelSize, this.pixelSize);
      }

      this.ws.send({
        action: 'draw',
        data: {x, y, color: this.mode === 'edit' ? this.color : 'white' }
      });
    }
  },
};
</script>

<style scoped>
.canvas-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
canvas {
  border: 1px solid #ccc;
  cursor: crosshair;
}
</style>
