const express = require('express');
const {DataHelper} = require("./DataHelper");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
let idLastModified;

// Route d'initialisation, pour la récupération des pixels
app.get('/api/longpolling/init', async (req, res) => {
    // Récupérations des pixels en base
    const pixels = await DataHelper.getPixels();

    // Envoie des pixels
    res.send({action: 'init', data: pixels});
});

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Route POST
app.post('/api/longpolling/setpixel', async (req, res) => {
    // Récupération des paramètres dans le body
    const {x, y, color} = req.body.data;

    // Récupération de potentiellement le pixel qui existe déjà
    const pixel = await DataHelper.getPixel(x, y);

    if (pixel) {
        // Si le pixel était déjà créé, alors on le change
        await DataHelper.setPixel(x, y, color);
        idLastModified = pixel.id;
    } else {
        // Sinon on le créé
        idLastModified = (await DataHelper.createPixel(x, y, color))[0].id;
    }

    res.status(200).send({idLastModified: idLastModified});
});

/**
 * Route de vérification des modifications long-polling
 */
app.post('/api/longpolling/update', async (req, res) => {
    // Récupération du dernier id modifié passé au front dans le body
    const lastModified = req.body.lastModified;
    console.log(lastModified, idLastModified)


    // Si le dernier id modifié est égale à celui stocké, ou est à null
    if (lastModified === null || lastModified === idLastModified)
    {
        // Alors on renvoie un no content il y a eus aucune modification
        res.status(204).end();
    }
    // Sinon on renvoie toutes les données, car elles ont été modifiées
    else
    {
        console.log('here')

        // Récupérations des pixels en base
        const pixels = await DataHelper.getPixels();

        console.log(pixels[-1])

        // Envoie des pixels
        res.send({action: 'init', data: pixels, lastModified: lastModified});
    }
});

const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Serveur Express en écoute sur http://localhost:${PORT}`);
});
