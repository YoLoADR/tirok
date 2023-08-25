tirok-server/
│
├── src/
│ ├── api/
│ │ ├── routes/
│ │ │ ├── users.js
│ │ │ ├── properties.js
│ │ │ ├── tokens.js
│ │ │ ├── transactions.js
│ │ │ ├── campaigns.js
│ │ │ └── ... (autres routes)
│ │ │
│ │ ├── controllers/
│ │ │ ├── usersController.js
│ │ │ ├── propertiesController.js
│ │ │ └── ... (autres contrôleurs)
│ │ │
│ │ ├── middleware/
│ │ │ └── ... (middlewares comme l'authentification, la validation, etc.)
│ │ │
│ │ └── helpers/
│ │ └── ... (fonctions utilitaires, par exemple pour manipuler les dates, etc.)
│ │
│ ├── config/
│ │ └── database.js (configuration de la base de données)
│ │
│ ├── services/
│ │ └── ... (services pour la logique métier, par exemple pour les calculs financiers)
│ │
│ └── models/
│ ├── user.js
│ ├── property.js
│ └── ... (autres modèles)
│
├── tests/
│ └── ... (tests unitaires et d'intégration)
│
├── public/ (ressources statiques comme les images, CSS, JS côté client)
│
├── views/ (templates pour la génération de vues, si nécessaire)
│
├── package.json
├── .gitignore
└── README.md