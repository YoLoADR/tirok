
const pool = require('../../config/database');
const stripe = require('../../config/stripe'); 

// After a user authenticates with Auth0, we want to check if this user already exists in our database. If not, we want to create it.
const ensureUser = async (req, res, next) => {
    let walletAddress, auth0Id, email;

    if (req.oidc.isAuthenticated()) {
        auth0Id = req.oidc.user.sub; // Auth0 ID
        email = req.oidc.user.email;
    } else if (req.headers['x-web3-address']) {
        walletAddress = req.headers['x-web3-address']; // Web3 address
    }

    if (auth0Id || walletAddress) {
        // Vérifiez si l'utilisateur existe déjà
        let user;
        if (auth0Id) {
            user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [auth0Id]);
        } else {
            user = await pool.query("SELECT * FROM users WHERE wallet_address = $1", [walletAddress]);
        }

        if (user.rows.length === 0) {
            // Créez l'utilisateur s'il n'existe pas
            const name = walletAddress ? 'Web3 User' : req.oidc.user.name;

            const newUser = await pool.query(
                "INSERT INTO users (username, email, auth0_id, wallet_address) VALUES ($1, $2, $3, $4) RETURNING user_id",
                [name, email, auth0Id, walletAddress]
            );

            // Attribuez le rôle "visitor" à l'utilisateur
            const visitorRoleId = (await pool.query("SELECT role_id FROM roles WHERE name = 'visitor'")).rows[0].role_id;
            await pool.query(
                "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
                [newUser.rows[0].user_id, visitorRoleId]
            );

            // Créer un client Stripe si ce n'est pas un utilisateur Web3
            if (auth0Id) {
                const customer = await stripe.customers.create({
                    email: email,
                    name: name,
                });

                // Mettre à jour la table users avec le stripe_customer_id
                await pool.query("UPDATE users SET stripe_customer_id = $1 WHERE user_id = $2", [customer.id, newUser.rows[0].user_id]);
            }
        }
    }

    next();
};


module.exports = ensureUser;
