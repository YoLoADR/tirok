const { Pool } = require('pg');

const pool = new Pool({
  user: 'yohannravino',
  host: 'localhost',
  database: 'tirok_db',
  password: 'yohannravino', // Remplacez par votre mot de passe
  port: 5432,
});

module.exports = pool;
