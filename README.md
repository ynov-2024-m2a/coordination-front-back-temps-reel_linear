
# Équipe Linear/Optimitisc rendering + Temps réel

Noé Zimmermann - Johan Rousseau - Célien Fiorelli - Geordi Gampio

Le projet est composé d'un front en VueJS et de 3 serveurs back utilisant les technologies de temps réel suivante :
- WebSocket (server.js) PORT 8081
- LongPolling (server_longpolling.js) PORT 8082
- Mercure (mercure-hub.js) PORT 8083

et PORT 8080 pour le front

# Installation

### Prérequis :
- Serveur web
- Serveur de base de donnée MySQL (ou MariaDB)

### Procédure :
- Lancer `npm i` dans le dossier "front" et le dossier "back"
- Importer l'export de base de donnée "back/init-db.sql" (Créé une base nommé pixel_war et créer la table pixels)
- Copié le contenu de "back/.env.example" dans un nouveau fichié "back/.env" et le compléter avec les informations de connexion de Base de donnée

### Lancement :
- Dans le dossier "front" faire `npm run serve`
- Dans le dossier "back" lancé les 3 serveurs avec `node server.js`, `node server_longpolling.js` et `node mercure-hub.js`
- (Sur Linux `npm run start` pour lancer les 3 en même temps)
- Aller ensuite sur http://localhost:8080/