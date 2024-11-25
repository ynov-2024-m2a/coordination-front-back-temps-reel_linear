<template>
  <div class="pixel-controls">
    <button @click="setEditMode" :class="{ active: mode === 'edit' }">
      Modifier un pixel
    </button>
    <button @click="setEraseMode" :class="{ active: mode === 'erase' }">
      Effacer un pixel
    </button>
    <ColorPicker :color="color" @color-change="updateColor" alpha-channel="hide" :visible-formats="['rgb']" />
  </div>
</template>

<script>
import { ColorPicker } from 'vue-accessible-color-picker'

export default {
  name: "ButtonAction",
  components: {
    ColorPicker,
  },
  data() {
    return {
      mode: 'edit',
      color: '#000000',
    };
  },
  methods: {
    setEditMode() {
      this.mode = 'edit';
      this.$emit('onModeChange', this.mode);
    },
    setEraseMode() {
      this.mode = 'erase';
      this.$emit('onModeChange', this.mode);
    },
    updateColor(event) {
      this.$emit('onColorChange', event.colors.hex.slice(0, 7));
    },
  },
};
</script>

<style scoped>
.pixel-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 200px;
}

button {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f9f9f9;
}

button:hover {
  background-color: #e6e6e6;
}

button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.color-picker {
  display: flex;
  flex-direction: column;
  align-items: start;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
}

input[type='color'] {
  width: 40px;
  height: 40px;
  border: none;
  cursor: pointer;
}
</style>