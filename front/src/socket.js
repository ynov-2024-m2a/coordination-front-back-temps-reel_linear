class Socket {
    constructor(webSocketType='websocket') {
        this.webSocketType = webSocketType;
        this.ws = null;
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
                const url = new URL('http://localhost:3000/.well-known/mercure');
                url.searchParams.append('topic', '/pixels');
                // url.searchParams.append('topic', 'https://example.com/users/dunglas');
                this.ws = new EventSource(url);// The callback will be called every time an update is published
                this.ws.onmessage = this.onmessage; // do something with the payload

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
                
                // Fonction pour envoyer des données au backend
                async function sendMessage(topic, data) {
                    try {
                        const response = await fetch('/pixels', { // Corrigé : endpoint /publish
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ topic, data }),
                        });
                
                        if (response.ok) {
                            console.log('Message publié avec succès.');
                        } else {
                            console.error('Erreur lors de la publication du message.');
                        }
                    } catch (error) {
                        console.error('Erreur:', error);
                    }
                }
                sendMessage('/pixels', data); // Envoi vers le bon topic
                
                break;
        }
    }
}

module.exports = { Socket }