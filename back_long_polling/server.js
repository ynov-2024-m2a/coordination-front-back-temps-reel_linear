const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = 5000;

app.get('/api/long-polling-endpoint', (req, res) => {
    console.log('Client connecté pour long polling...');
    res.status(205).send();
});

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
