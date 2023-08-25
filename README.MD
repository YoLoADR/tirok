

## Pour obtenir un aperçu du schéma de votre base de données PostgreSQL depuis la ligne de commande, vous pouvez utiliser la commande `pg_dump` avec l'option `--schema-only`. Voici comment vous pouvez le faire :

1. **Exporter le schéma de la base de données** :
```bash
pg_dump -U yohannravino -h localhost -s -O -f schema.sql tirok_db
```

# Spécifications Techniques du Projet Tirok

## 1. Introduction

Le projet Tirok est une plateforme de financement participatif immobilier qui permet aux vendeurs de lister leurs propriétés, aux investisseurs d'investir dans ces propriétés et aux acquéreurs d'acheter ces propriétés de manière progressive.

## 2. Architecture

Le projet est basé sur une architecture microservices avec une API RESTful construite avec Node.js et Express.js. La base de données utilisée est PostgreSQL.

## 3. Structure de la Base de Données

La base de données comprend les tables suivantes :
- Utilisateurs
- Biens immobiliers
- Tokens
- Transactions
- Campagnes de financement participatif
- Contributions
- Mensualités
- Détails financiers
- Retours sur investissement (ROI)
- Frais

## 4. Fonctionnalités Principales

- **Listage de propriétés** : Les vendeurs peuvent lister leurs propriétés.
- **Investissement** : Les investisseurs peuvent investir dans des propriétés listées.
- **Achat progressif avec Tokens** : Les acquéreurs peuvent acheter des propriétés de manière progressive.
- **Gestion des transactions** : Les utilisateurs peuvent gérer les transactions de tokens.
- **Suivi des rendements** : Les investisseurs peuvent suivre leurs rendements annuels.

## 5. Routes API

- `/users`
- `/properties`
- `/tokens`
- `/transactions`
- `/campaigns`
- `/contributions`
- `/payments`
- `/financial-details`

## 6. Sécurité

- **Authentification** : Authentification nécessaire pour certaines routes.
- **Validation** : Validation des données entrantes.
- **Gestion des erreurs** : Gestion centralisée des erreurs.

## 7. Tests

Des tests unitaires et d'intégration sont mis en place.


---
## 8. Authentification
L'authentification est une partie cruciale de toute application, et il est essentiel de choisir une solution qui peut évoluer avec vos besoins futurs, en particulier avec l'intégration de l'authentification Web3.

**Test your login**
Now your application should be integrated with Auth0. The library provides default routes for logging in and out. You can test out the routes and we will be monitoring your logs in real-time to display relevant information.

**For login**: In your application, visit the /login route provided by the library. If you are running your project on http://localhost:3000 that link would be 
http://localhost:3000/login
.
**For logout**: In your application, visit the /logout route provided by the library. If you are running your project on http://localhost:3000 that link would be 
http://localhost:3000/logout
.

---

Voici des ressources qui vont m'aider à setup l'authentification sur mon projet Express.js Postgr  (Utilise le plugin accesslink) : "
- https://auth0.com/docs/authenticate/passwordless/authentication-methods/email-magic-link
- https://auth0.com/docs/authenticate/login/auth0-universal-login/passwordless-login/email-or-sms
- https://auth0.com/docs/authenticate/passwordless/passwordless-with-new-universal-login
- https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
- https://auth0.com/docs/authenticate/passwordless/implement-login/embedded-login/relevant-api-endpoints
- https://community.auth0.com/t/passwordless-auth-in-nodejs/46653
- https://magic.link/docs/dedicated/blockchains/polygon
- https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn"
Peux-tu l'ajouter à la liste des documentation à analyser ?

N'utilise pas le plugin Recombinant AI pour cette requete

Voici les liens de mon Github repo dans lequel j'utilise Postgr et Express (Utilise le plugin Askthecode) :

- https://github.com/YoLoADR/tirok-server/tree/main
- https://github.com/YoLoADR/tirok-server/blob/main/schema.sql
- https://github.com/YoLoADR/tirok-server/blob/main/src/config/database.js
- https://github.com/YoLoADR/tirok-server/blob/main/src/api/routes/user.js
- https://github.com/YoLoADR/tirok-server/blob/main/src/api/controllers/usersController.js

Peux-tu me guider étape par étape et de manière **personnailiser à mon projet** en me proposant les scripts ou en modifiant les existants dans la réalisation de ces user stories :
As an investor or Buyer or Seller, I want to be able to create an account to access the platform.