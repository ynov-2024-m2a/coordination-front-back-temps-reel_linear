class Socket {
    constructor(webSocketType='websocket') {
        this.webSocketType = webSocketType;
        this.ws = null;
        this.socketTopic = []
        this.onmessage = () => {}
    }

    connect () {
        switch (this.webSocketType) {
            case 'websocket':
                this.ws = new WebSocket('ws://localhost:5000');
                this.ws.onmessage = this.onmessage;
                break;
        
            case 'longPolling':
                
                break;
        
            case 'mercure':
                // eslint-disable-next-line no-case-declarations
                for (const topic of ['pixels', 'messages']) {
                    const url = new URL('http://localhost:3000/sse');
                    url.searchParams.append('topic', '/' + topic);
                    
                    this.socketTopic.push(new EventSource(url));
                    this.socketTopic[this.socketTopic.length - 1].onmessage = this.onmessage;
                }
                break;
        }
    }
    
    send (data) {
        switch (this.webSocketType) {
            case 'websocket':
                if (this.ws.readyState == WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data))
                }
                break;
        
            case 'longPolling':
                
                break;
        
            case 'mercure':
                fetch('http://localhost:3000/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: data.action === 'draw' ? '/pixels' : '/messages',
                        data: { ...data }
                    }),
                });
                break;
        }
    }
}

module.exports = { Socket }