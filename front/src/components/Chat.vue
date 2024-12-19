<template>
    <div class="chat-container">
      <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <span class="user">{{ message.user }}:</span>
          <span class="text">{{ message.text }}</span>
        </div>
      </div>
      <form @submit.prevent="sendMessage">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Tapez votre message..."
          class="chat-input"
        />
        <button type="submit" class="send-button">Envoyer</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name:"ChatComponent",
    props: {
      messages: { type: Array, required: true },
      ws: { type: Object, required: true },
      user: { type: String, required: true },
    },
    data() {
      return {
        newMessage: "",
      };
    },
    methods: {
      sendMessage() {
        if (!this.newMessage.trim()) return;
  
        const message = { user: this.user, text: this.newMessage };
        if (this.ws) {
          this.ws.send({ action: "msg", data: message });
        }
  
        // this.messages.push(message);
        this.newMessage = "";
      },
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .chat-messages {
    max-height: 200px;
    overflow-y: auto;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }
  .message {
    margin-bottom: 5px;
  }
  .user {
    margin-right: 5px;
    font-weight: bold;
  }
  .chat-input {
    flex: 1;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .send-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .send-button:hover {
    background-color: #0056b3;
  }
  </style>
  