const express = require('express');
const expressWs = require('express-ws');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { DataHelper } = require('./DataHelper');
const { default: axios } = require('axios');
const port = 8083

const app = express();
expressWs(app);

app.use(cors({
    origin: '*',  // Permet à toutes les origines d'accéder aux ressources
    methods: ['GET', 'POST'],  // Permet les méthodes GET et POST
    allowedHeaders: ['Content-Type', 'Authorization']  // Autorise les headers spécifiques
}));

const clients = new Map(); // Stocke les clients abonnés, indexés par topic

// Middleware pour parser les requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function publishMessage(topic, data) {
    await axios.post(`http://localhost:${port}/publish`, JSON.stringify({
        topic: topic,
        data: data
    }), {headers: { 'Content-Type': 'application/json' }})
}

// Endpoint pour s'abonner à un topic (SSE)
app.get('/sse', async (req, res) => {
    const topic = req.query.topic;

    if (!topic) {
        return res.status(400).send('Topic is required');
    }

    // Configurer la réponse pour Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!clients.has(topic)) {
        clients.set(topic, []);
    }

    clients.get(topic).push(res);

    if (topic === '/pixels') {
        const pixels = await DataHelper.getPixels();
        publishMessage('/pixels', { action: "init", data: pixels })
    }
    
    // Supprimer le client à la déconnexion
    req.on('close', () => {
        const clientList = clients.get(topic).filter((client) => client !== res);
        clients.set(topic, clientList);
        console.log('close');
        
    });
});

// Endpoint pour publier un message sur un topic
app.post('/publish', async (req, res) => {
    
    const { topic, data } = req.body;
    // console.log(topic, data);

    if (!topic || !data) {
        return res.status(400).send('Topic and data are required');
    }

    if (topic === '/pixels') {
        if (data.action === "draw") {
            const pixel = await DataHelper.getPixel(data.data.x, data.data.y)
            if (pixel) {
                await DataHelper.setPixel(data.data.x, data.data.y, data.data.color)
            } else {
                await DataHelper.createPixel(data.data.x, data.data.y, data.data.color)
            }
        }
    }

    // Envoyer le message à tous les clients abonnés au topic
    if (clients.has(topic)) {
        clients.get(topic).forEach((client) => {
            client.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    }

    res.status(200).send('Message published');
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Hub Mercure personnalisé en écoute sur http://localhost:${port}`);
});
