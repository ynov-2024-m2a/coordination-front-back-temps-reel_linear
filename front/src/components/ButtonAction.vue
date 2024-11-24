<template>
    <div class="pixel-controls">
      <button @click="setEditMode" :class="{ active: mode === 'edit' }">
        Modifier un pixel
      </button>
      <button @click="setEraseMode" :class="{ active: mode === 'erase' }">
        Effacer un pixel
      </button>
      <div class="color-picker">
        <label for="color">Choisir une couleur:</label>
        <input id="color" type="color" v-model="color" @input="updateColor" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name:"ButtonComponent",
    props: {
      onModeChange: {
        type: Function,
        required: true, // Une fonction à appeler lors du changement de mode
      },
      onColorChange: {
        type: Function,
        required: true, // Une fonction à appeler lors du changement de couleur
      },
    },
    data() {
      return {
        mode: 'edit', // Modes possibles : 'edit', 'erase'
        color: '#000000', // Couleur par défaut
      };
    },
    methods: {
      setEditMode() {
        this.mode = 'edit';
        this.onModeChange(this.mode); // Notifie le parent du changement de mode
      },
      setEraseMode() {
        this.mode = 'erase';
        this.onModeChange(this.mode); // Notifie le parent du changement de mode
      },
      updateColor() {
        this.onColorChange(this.color); // Notifie le parent de la couleur choisie
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
  