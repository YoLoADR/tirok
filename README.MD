

## Pour obtenir un aperçu du schéma de votre base de données PostgreSQL depuis la ligne de commande, vous pouvez utiliser la commande `pg_dump` avec l'option `--schema-only`. Voici comment vous pouvez le faire :

1. **Exporter le schéma de la base de données** :
```bash
pg_dump -U yohannravino -h localhost -s -O -f schema.sql tirok_db
```


tirok-server/
│
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── users.js
│   │   │   ├── properties.js
│   │   │   ├── tokens.js
│   │   │   ├── transactions.js
│   │   │   ├── campaigns.js
│   │   │   └── ... (autres routes)
│   │   │
│   │   ├── controllers/
│   │   │   ├── usersController.js
│   │   │   ├── propertiesController.js
│   │   │   └── ... (autres contrôleurs)
│   │   │
│   │   ├── middleware/
│   │   │   └── ... (middlewares comme l'authentification, la validation, etc.)
│   │   │
│   │   └── helpers/
│   │       └── ... (fonctions utilitaires, par exemple pour manipuler les dates, etc.)
│   │
│   ├── config/
│   │   └── database.js (configuration de la base de données)
│   │
│   ├── services/
│   │   └── ... (services pour la logique métier, par exemple pour les calculs financiers)
│   │
│   └── models/
│       ├── user.js
│       ├── property.js
│       └── ... (autres modèles)
│
├── tests/
│   └── ... (tests unitaires et d'intégration)
│
├── public/ (ressources statiques comme les images, CSS, JS côté client)
│
├── views/ (templates pour la génération de vues, si nécessaire)
│
├── package.json
├── .gitignore
└── README.md
