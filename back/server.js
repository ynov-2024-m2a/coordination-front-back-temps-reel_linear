const express = require('express');
const http = require('http');
require('dotenv').config();
const webSocket = require('ws');


const app = express()
const server = http.createServer(app)
const ws = new webSocket.Server({ server })

mongoose.connect(process.env.CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("[+] Database connected");
})
    .catch((err) => {
        console.error(`Error\n${err}`);
    })

ws.on('connection', socket => {
    (async () => {
        socket.send(JSON.stringify({ action: "init", data: {} }))
    })();

    socket.on('message', m => {
        const { action, data } = JSON.parse(m);

        if (["draw", "msg"].includes(action)) {
            ws.clients.forEach(client => {
                if (client.readyState == webSocket.OPEN)
                    client.send(JSON.stringify({ action, data }))
            })
        }
        if (action === "draw") {

        }
        if (action === "join") {
            ws.clients.forEach(client => {
                if (client.readyState == webSocket.OPEN)
                    client.send(JSON.stringify({ action: "msg", data: { author: data.pseudo, content: "viens de se connecter !", type: 2 } }))
            })
        }
    });
});



const port = 5000;
server.listen(port, () => {
    console.log(`Listen on ${port}`);
});

