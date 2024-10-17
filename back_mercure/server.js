const express = require('express');
const http = require('http');
const axios = require('axios'); 
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// URL du hub Mercure
const MERCURE_HUB_URL = 'http://localhost:3000/.well-known/mercure';

// Fonction pour publier un événement à Mercure
const publishToMercure = async (topic, data) => {

    try {
        await axios.post(MERCURE_HUB_URL, null, {
            params: {
                topic,
                data: JSON.stringify(data)
            },
        });
    } catch (error) {
        console.log('Error publishing to Mercure:', error);
    }
};

app.use(express.json());

// Exemple d'un endpoint pour publier des messages
app.post('/publish', (req, res) => {
    const { action, data } = req.body;

    if (["draw", "msg", "join"].includes(action)) {
        // Publie l'événement à tous les clients abonnés au topic
        publishToMercure('http://my-app/updates', { action, data });
    }

    console.log({ status: 'OK' });
});

const port = 5000;
server.listen(port, () => {
    console.log(`Listen on ${port}`);
});
