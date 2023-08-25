const pool = require('../../config/database');

exports.getUserById = async (req, res) => {
    const auth0_id = req.params.id; // Assurez-vous que l'ID est passé dans l'URL

    try {
        const user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [auth0_id]);

        if (user.rows.length === 0) {
            return res.status(404).send("User not found");
        }

        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// exports.updateUser = async (req, res) => {
//     const auth0_id = req.params.id;
//     const { username, email, wallet_address, role } = req.body; // Les champs que vous souhaitez mettre à jour

//     try {
//         const updatedUser = await pool.query(
//             "UPDATE users SET username = $1, email = $2, wallet_address = $3, role = $4 WHERE auth0_id = $5 RETURNING *",
//             [username, email, wallet_address, role, auth0_id]
//         );

//         if (updatedUser.rows.length === 0) {
//             return res.status(404).send("User not found");
//         }

//         res.json(updatedUser.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// };

exports.deleteUser = async (req, res) => {
    const auth0_id = req.params.id;

    try {
        const deletedUser = await pool.query("DELETE FROM users WHERE auth0_id = $1 RETURNING *", [auth0_id]);

        if (deletedUser.rows.length === 0) {
            return res.status(404).send("User not found");
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// ... autres méthodes du contrôleur
