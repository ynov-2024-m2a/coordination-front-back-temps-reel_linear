const express = require('express');
const http = require('http');
const { DataHelper } = require('../back/DataHelper'); // Assurez-vous que ce chemin est correct
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const MERCURE_HUB_URL = 'http://localhost:3000/.well-known/mercure';

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour gérer les CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/.well-known/mercure'); // Remplacez par votre frontend
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Méthodes autorisées
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // En-têtes autorisés
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Si nécessaire pour des cookies
    next();
});

// Fonction pour publier des événements sur Mercure
const publishToMercure = async (topic, data) => {
    try {
        await axios.post(MERCURE_HUB_URL, null, {
            params: {
                topic,
                data: JSON.stringify(data),
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'CORS_ALLOWED_ORIGINS' : 'http://localhost:8080',
                'CORS_ALLOWED_ORIGINS' : 'http://localhost:3000'

            },
        });
        console.log('Événement publié sur Mercure :', { topic, data });
    } catch (error) {
        console.error('Erreur lors de la publication sur Mercure:', error.response?.data || error.message);
    }
};

// Endpoint pour publier des événements
app.post('/pixels', async (req, res) => {
    const { action, data } = req.body;

    try {
        if (action === 'draw') {
            const pixel = await DataHelper.getPixel(data.x, data.y);
            if (pixel) {
                await DataHelper.setPixel(data.x, data.y, data.color);
            } else {
                await DataHelper.createPixel(data.x, data.y, data.color);
            }
        }

        if (action === 'init') {
            const pixels = await DataHelper.getPixels();
            publishToMercure('/pixels', { action: 'init', data: pixels });
        }

        if (['draw', 'msg', 'join'].includes(action)) {
            publishToMercure('/pixels', { action, data });
        }

        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error('Erreur dans /pixels:', error.message);
        res.status(500).json({ status: 'ERROR', error: error.message });
    }
});

const port = 5000;
server.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
