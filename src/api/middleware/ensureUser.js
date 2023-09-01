
const pool = require('../../config/database');

// After a user authenticates with Auth0, we want to check if this user already exists in our database. If not, we want to create it.
const ensureUser = async (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        const { name, email, sub: auth0_id } = req.oidc.user;

        // Vérifiez si l'utilisateur existe déjà
        const user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [auth0_id]);

        if (user.rows.length === 0) {
            // Si l'utilisateur n'existe pas, créez-le
            const newUser = await pool.query(
                "INSERT INTO users (username, email, auth0_id) VALUES ($1, $2, $3) RETURNING user_id",
                [name, email, auth0_id]
            );

            // Attribuez le rôle "visitor" à l'utilisateur
            const visitorRoleId = (await pool.query("SELECT role_id FROM roles WHERE name = 'visitor'")).rows[0].role_id;
            await pool.query(
                "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
                [newUser.rows[0].user_id, visitorRoleId]
            );
        }
    }
    next();
};


module.exports = ensureUser;
