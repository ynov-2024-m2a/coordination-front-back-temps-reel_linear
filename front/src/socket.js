const { default: axios } = require('axios');

class Socket {
    constructor(webSocketType = 'websocket') {
        this.webSocketType = webSocketType;
        this.ws = null;
        this.socketTopic = []
        this.onmessage = () => {
        }
        this.lastModified = null;
    }

    connect() {
        switch (this.webSocketType) {
            case 'websocket':
                this.ws = new WebSocket('ws://localhost:8081');
                this.ws.onmessage = (res) => {
                    return this.onmessage(JSON.parse(res.data));
                }

                break;

            case 'longPolling':
                // Route à appeler à l'initialisation
                axios.get('http://localhost:8082/api/longpolling/init')
                    .then(res => {
                        this.onmessage(res.data);
                    })

                setInterval(() => {
                    axios.post('http://localhost:8082/api/longpolling/update', {'lastModified': this.lastModified})
                        .then(res => {
                            if (res.status === 200) {
                                this.lastModified = res.data.lastModified;
                                this.onmessage(res.data);
                            }
                        })
                }, 500);

                break;

            case 'mercure':
                // eslint-disable-next-line no-case-declarations
                for (const topic of ['pixels', 'messages']) {
                    const url = new URL('http://localhost:8083/sse');
                    url.searchParams.append('topic', '/' + topic);

                    this.socketTopic.push(new EventSource(url));
                    this.socketTopic[this.socketTopic.length - 1].onmessage = (res) => {
                        return this.onmessage(JSON.parse(res.data));
                    };
                }
                break;
        }
    }

    send(data) {
        switch (this.webSocketType) {
            case 'websocket':
                if (this.ws.readyState == WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data))
                }
                break;

            case 'longPolling':
                axios.post('http://localhost:8082/api/longpolling/setpixel', data)
                    .then(res => {
                        this.lastModified = res.data.idLastModified;
                        this.onmessage(res.data);
                    })
                break;

            case 'mercure':
                fetch('http://localhost:8083/publish', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        topic: data.action === 'draw' ? '/pixels' : '/messages',
                        data: {...data}
                    }),
                });
                break;
        }
    }
}

module.exports = {Socket}