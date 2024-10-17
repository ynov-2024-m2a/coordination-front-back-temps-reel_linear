export default {
    data() {
        return {
            status: 'Aucune requête effectuée', // État pour afficher le statut de la requête
        };
    },
    methods: {
        // Méthode pour effectuer l'appel GET au serveur (long polling)
        simpleLongPolling() {
            this.status = 'En cours...';

            fetch('http://localhost:5000/api/long-polling-endpoint') // Appel à ton endpoint backend
                .then(response => {
                    if (response.status === 204) {
                        this.status = 'Pas de contenu, statut 204'; // Gestion du code de statut 204
                    } else {
                        this.status = 'Réponse inattendue';
                    }
                })
                .catch(error => {
                    this.status = `Erreur : ${error.message}`; // En cas d'erreur
                });
        }
    },
    mounted() {
        // Lancer l'appel long polling lorsque le composant est monté
        this.simpleLongPolling();
    }
};