const express = require('express');
const {DataHelper} = require("./DataHelper");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
let lastModified = null;
let hasModify = false;

app.get('/api/longpolling/init', async (req, res) => {
    // Récupérations des pixels en base
    const pixels = await DataHelper.getPixels();

    res.send({action: 'init', data: pixels});
});

app.use(bodyParser.json());

app.post('/api/longpolling/setpixel', async (req, res) => {

    if (!req.body.data.x || !req.body.data.y || !req.body.data.color) {
        res.status(400);
    } else {
        const {x, y, color} = req.body.data;

        const pixel = await DataHelper.getPixel(x, y);

        // Créer ou mettre à jour le pixel
        if (pixel) {
            await DataHelper.setPixel(x, y, color);
            lastModified = await createlastModified({id: pixel.id, color: color});
        } else {
            lastModified = await createlastModified({id: await DataHelper.createPixel(x, y, color), color: color});
        }

        hasModify = true;

        res.status(200).end();
    }
});

/**
 * Route de vérification des modifications long-polling
 */
app.post('/api/longpolling/update', async (req, res) => {
    const lastModifiedGetted = req.body.lastModified;
    lastModified = lastModified !== null ? lastModified : await createlastModified();

    let intervalId = setInterval(async () => {

        if (lastModifiedGetted !== lastModified || hasModify) {
            const pixels = await DataHelper.getPixels();
            res.send({action: 'init', data: pixels, lastModified: lastModified});

            clearInterval(intervalId);
            hasModify = false;
        }
    }, 500);
});

async function createlastModified(pixel = null) {
    const pixelInfo = pixel === null ? await DataHelper.getLastPixel() : pixel;

    return `${pixelInfo.id}${pixelInfo.color}`
}


const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Serveur Express en écoute sur http://localhost:${PORT}`);
});
