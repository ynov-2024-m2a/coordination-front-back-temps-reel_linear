const express = require('express');
const http = require('http');
const { DataHelper } = require('../back/DataHelper');
const axios = require('axios'); 
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const MERCURE_HUB_URL = 'http://localhost:3000/.well-known/mercure';

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
app.post('/publish', async (req, res) => {
    const { action, data } = req.body;

    if (action === "draw") {
        const pixel = await DataHelper.getPixel(data.x, data.y)
        if (pixel) {
            await DataHelper.setPixel(data.x, data.y, data.color)
        } else {
            await DataHelper.createPixel(data.x, data.y, data.color)
        }
    }


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
