// src/graphql/resolvers.js

const pool = require('../config/database');

const resolvers = {
  Query: {
    getUserById: async (_, { auth0_id }) => {
      const user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [auth0_id]);
      return user.rows[0];
    },
  },
  Mutation: {
    updateUser: async (_, args) => {
        const { auth0_id, ...updateFields } = args;
    
        if (Object.keys(updateFields).length === 0) {
            throw new Error("No fields to update");
        }
    
        const fields = Object.keys(updateFields).map((key, index) => `${key} = $${index + 1}`);
        const values = Object.values(updateFields).concat(auth0_id);
    
        const query = `UPDATE users SET ${fields.join(", ")} WHERE auth0_id = $${values.length} RETURNING *`;
    
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    deleteUser: async (_, { auth0_id }) => {
        const result = await pool.query("DELETE FROM users WHERE auth0_id = $1 RETURNING *", [auth0_id]);
        
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        
        return true;
    },
  },
};

module.exports = resolvers;
