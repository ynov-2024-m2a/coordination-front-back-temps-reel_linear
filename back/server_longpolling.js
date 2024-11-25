const express = require('express');
const {DataHelper} = require("./DataHelper");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());

// Route d'initialisation, pour la récupération des pixels
app.get('/api/longpolling/init', async (req, res) => {
    // Récupérations des pixels en base
    const pixels = await DataHelper.getPixels();

    // Envoie des pixels
    res.send({data: pixels});
});

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Route POST
app.post('/api/longpolling/setpixel', async (req, res) => {
    // Récupération des paramètres dans le body
    const {x, y, color} = req.body;

    // Vérifications du paramètre x
    if (typeof x !== 'number' || !Number.isInteger(x)) {
        return res.status(400).json({error: 'x doit être un entier.'});
    }

    // Vérifications du paramètre y
    if (typeof y !== 'number' || !Number.isInteger(y)) {
        return res.status(400).json({error: 'y doit être un entier.'});
    }

    // Vérifications du paramètre de la couleur
    const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;
    if (typeof color !== 'string' || !hexColorRegex.test(color)) {
        return res.status(400).json({error: 'color doit être une chaîne hexadécimale valide, comme #FFFFFF.'});
    }

    // Récupération de potentiellement le pixel qui existe déjà
    const pixel = await DataHelper.getPixel(x, y)

    // invalidation du cache

    if (pixel) {
        // Si le pixel était déjà créé, alors on le change
        await DataHelper.setPixel(x, y, color);

        // Envoie de la réponse comme quoi ça a bien été modifié
        res.status(200).end();
    } else {
        // Sinon on le créé
        await DataHelper.createPixel(x, y, color);

        // Envoie de la réponse comme quoi ça a bien été créé
        res.status(201).end();
    }
});

function f() {
    // regarder si il y a eus une modif  => regarder état du cahce

//     Si modif
        // REnvoie de la différence

//     sinon envoyer n content
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur Express en écoute sur http://localhost:${PORT}`);
});
