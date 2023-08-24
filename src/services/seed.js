
const { faker } = require('@faker-js/faker');

app.get('/populate', async (req, res) => {
    // Ajout des utilisateurs fictifs
    const users = [
      { name: 'Hilary', role: 'Investisseur' },
      { name: 'Fabien', role: 'Investisseur' },
      { name: 'Yohann', role: 'Investisseur' },
      { name: 'Romain', role: 'Investisseur' },
      { name: 'Eloi', role: 'Investisseur' },
      { name: 'Bastien', role: 'Vendeur' },
      { name: 'Ismael', role: 'Acquéreur' },
    ];
  
    for (let user of users) {
      await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
        [user.name, faker.internet.email(), faker.internet.password(), user.role]
      );
    }
  
    // Ajout d'autres données fictives (biens immobiliers, tokens, transactions, etc.)
    // ...
  
    res.send('Base de données remplie avec succès!');
  });