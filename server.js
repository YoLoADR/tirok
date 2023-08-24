const express = require('express');
const pool = require('./src/config/database');
const usersRoutes = require('./src/api/routes/users');
const propertiesRoutes = require('./src/api/routes/properties');
// ... autres imports de routes

app.use(express.json()); // Pour pouvoir lire le corps des requêtes POST

const PORT = 3000;

app.use('/api/users', usersRoutes);
app.use('/api/properties', propertiesRoutes);
// ... autres utilisations de routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
