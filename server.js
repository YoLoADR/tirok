const express = require('express');
const { auth } = require('express-openid-connect');
const authConfig = require('./src/config/authConfig');
// const { requiresAuth } = require('express-openid-connect');
const usersRoutes = require('./src/api/routes/user');
// const propertiesRoutes = require('./src/api/routes/properties');
require('dotenv').config();
const ensureUser = require('./src/api/middleware/ensureUser');

// ... autres imports de routes

const app = express();
const PORT = 3000;


// Utilisez le routeur d'authentification
app.use(auth(authConfig));
app.use(ensureUser);
// Ajoutez une route pour vérifier si l'utilisateur est authentifié
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? `Logged in : ${JSON.stringify(req.oidc.user)}` : 'Logged out');
});
// Any route using "requiresAuth" middleware will check for a valid user session and, if one does not exist, it will redirect the user to log in.
// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });
app.use('/api/users', usersRoutes);
// app.use('/api/properties', propertiesRoutes);


// ... autres utilisations de routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
