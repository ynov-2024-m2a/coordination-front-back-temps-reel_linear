<template>
    <div class="modal">
      <div class="modal-content">
        <h2>Bienvenue dans Pixel Wars</h2>
        <input v-model="pseudo" placeholder="Entrez votre pseudo" />
        <button @click="savePseudo">Rejoindre</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name:"ModalComponent",
    data() {
      return {
        pseudo: "",
      };
    },
    methods: {
      savePseudo() {
        if (this.pseudo.trim()) {
          this.$emit("savePseudo", this.pseudo);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
  </style>
  