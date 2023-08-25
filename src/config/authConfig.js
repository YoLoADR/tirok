module.exports = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET || 'a long, randomly-generated string stored in env',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID || 'EuzYdTl6CG1UUTzKdFZvGE9JasOUni07',
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://yohann-ravino.eu.auth0.com'
  };