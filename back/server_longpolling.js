const express = require('express');
const {DataHelper} = require("./DataHelper");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
let idLastModified;

app.get('/api/longpolling/init', async (req, res) => {
    // Récupérations des pixels en base
    const pixels = await DataHelper.getPixels();

    res.send({action: 'init', data: pixels});
});

app.use(bodyParser.json());

app.post('/api/longpolling/setpixel', async (req, res) => {
    const {x, y, color} = req.body.data;

    const pixel = await DataHelper.getPixel(x, y);

    // Créer ou mettre à jour le pixel
    if (pixel) {
        await DataHelper.setPixel(x, y, color);
        idLastModified = pixel.id;
    } else {
        const pixelId = await DataHelper.createPixel(x, y, color);
        idLastModified = pixelId;
    }

    res.status(200).send({idLastModified: idLastModified});
});

/**
 * Route de vérification des modifications long-polling
 */
app.post('/api/longpolling/update', async (req, res) => {
    const lastModified = req.body.lastModified;
    let intervalId;
    idLastModified = await DataHelper.getLastPixel();

    intervalId = setInterval(async () => {
        if (lastModified !== idLastModified || lastModified === null) {
            const pixels = await DataHelper.getPixels();
            res.send({action: 'init', data: pixels, lastModified: idLastModified});
            clearInterval(intervalId);
        }
    }, 500);
});


const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Serveur Express en écoute sur http://localhost:${PORT}`);
});
