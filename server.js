// const { requiresAuth } = require('express-openid-connect');
const express = require('express');
const { auth } = require('express-openid-connect');
const { ApolloServer } = require('apollo-server-express');
const authConfig = require('./src/config/authConfig');
require('dotenv').config();
const ensureUser = require('./src/api/middleware/ensureUser');
const typeDefs = require('./src/api/schema');
const resolvers = require('./src/api/resolvers');

// Express
const app = express();
const PORT = 3000;

// Utilisez le routeur d'authentification
app.use(auth(authConfig));
app.use(ensureUser);

// Ajoutez une route pour vérifier si l'utilisateur est authentifié
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? `Logged in : ${JSON.stringify(req.oidc.user)}` : 'Logged out');
});

// GraphQL
const server = new ApolloServer({ typeDefs, resolvers });

// Assurez-vous de démarrer le serveur Apollo avant d'appliquer le middleware
(async () => {
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();

