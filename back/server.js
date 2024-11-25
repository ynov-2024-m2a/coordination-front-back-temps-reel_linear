const express = require('express');
const http = require('http');
const webSocket = require('ws');
const { DataHelper } = require('./DataHelper');


const app = express()
const server = http.createServer(app)
const ws = new webSocket.Server({ server })

ws.on('connection', async (socket) => {
    const pixels = await DataHelper.getPixels();
    socket.send(JSON.stringify({ action: "init", data: pixels }))

    socket.on('message', async (m) => {
        const { action, data } = JSON.parse(m);

        if (action === "draw") {
            const pixel = await DataHelper.getPixel(data.x, data.y)
            if (pixel) {
                await DataHelper.setPixel(data.x, data.y, data.color)
            } else {
                await DataHelper.createPixel(data.x, data.y, data.color)
            }
        }

        if (["draw", "msg"].includes(action)) {
            ws.clients.forEach(client => {
                if (client.readyState == webSocket.OPEN)
                    client.send(JSON.stringify({ action, data }))
            })
        }

        if (action === "join") {
            ws.clients.forEach(client => {
                if (client.readyState == webSocket.OPEN) {
                    client.send(JSON.stringify({ action: "msg", data: { author: data.pseudo, content: "viens de se connecter !", type: 2 } }))
                }
            })
        }
    });
});



const port = 8081;
server.listen(port, () => {
    console.log(`Listen on ${port}`);
});

