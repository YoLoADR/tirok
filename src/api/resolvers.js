// src/graphql/resolvers.js

const pool = require('../config/database');

const resolvers = {
  Query: {
    getUserById: async (_, { auth0_id }) => {
      const user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [auth0_id]);
      const roles = await pool.query("SELECT r.* FROM roles r JOIN user_roles ur ON r.role_id = ur.role_id WHERE ur.user_id = $1", [user.rows[0].user_id]);
      return {
          ...user.rows[0],
          roles: roles.rows
      };
    },
    getProperty: async (_, { property_id }) => {
      const result = await pool.query("SELECT * FROM properties WHERE property_id = $1", [property_id]);
      return result.rows[0];
    },
    getAllProperties: async () => {
      const result = await pool.query("SELECT * FROM properties");
      return result.rows;
    },
    getCampaign: async (_, { campaign_id }) => {
        const result = await pool.query("SELECT * FROM campaigns WHERE campaign_id = $1", [campaign_id]);
        return result.rows[0];
    },
    getAllCampaigns: async () => {
      const result = await pool.query("SELECT * FROM campaigns");
      return result.rows;
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
    addUserRole: async (_, { auth0_id, roleName }) => {
      // Récupérez l'ID de l'utilisateur et l'ID du rôle ('visitor'), ('seller'), ('investor'), ('buyer');
      const user = (await pool.query("SELECT user_id FROM users WHERE auth0_id = $1", [auth0_id])).rows[0];
      const role = (await pool.query("SELECT role_id FROM roles WHERE name = $1", [roleName])).rows[0];

      if (!user || !role) {
          throw new Error("User or role not found");
      }

      // Ajoutez le rôle à l'utilisateur
      await pool.query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [user.user_id, role.role_id]);

      return true;
  },
  removeUserRole: async (_, { auth0_id, roleName }) => {
      // Récupérez l'ID de l'utilisateur et l'ID du rôle
      const user = (await pool.query("SELECT user_id FROM users WHERE auth0_id = $1", [auth0_id])).rows[0];
      const role = (await pool.query("SELECT role_id FROM roles WHERE name = $1", [roleName])).rows[0];

      if (!user || !role) {
          throw new Error("User or role not found");
      }

      // Supprimez le rôle de l'utilisateur
      await pool.query("DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2", [user.user_id, role.role_id]);

      return true;
  },
  createProperty: async (_, { input }) => {
    const values = Object.values(input);
    const query = `INSERT INTO properties (${Object.keys(input).join(", ")}) VALUES (${values.map((_, idx) => `$${idx + 1}`).join(", ")}) RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }, 
  updateProperty: async (_, { property_id, input }) => {
      const fields = Object.keys(input).map((key, index) => `${key} = $${index + 1}`);
      const values = Object.values(input).concat(property_id);
      const query = `UPDATE properties SET ${fields.join(", ")} WHERE property_id = $${values.length} RETURNING *`;
      const result = await pool.query(query, values);
      return result.rows[0];
  },
  deleteProperty: async (_, { property_id }) => {
      const result = await pool.query("DELETE FROM properties WHERE property_id = $1", [property_id]);
      return result.rowCount > 0;
  },
  createCampaign: async (_, { input }) => {
      const values = Object.values(input);
      const query = `INSERT INTO campaigns (${Object.keys(input).join(", ")}) VALUES (${values.map((_, idx) => `$${idx + 1}`).join(", ")}) RETURNING *`;
      const result = await pool.query(query, values);
      return result.rows[0];
  },
  updateCampaign: async (_, { campaign_id, input }) => {
      const fields = Object.keys(input).map((key, index) => `${key} = $${index + 1}`);
      const values = Object.values(input).concat(campaign_id);
      const query = `UPDATE campaigns SET ${fields.join(", ")} WHERE campaign_id = $${values.length} RETURNING *`;
      const result = await pool.query(query, values);
      return result.rows[0];
  },
  deleteCampaign: async (_, { campaign_id }) => {
      const result = await pool.query("DELETE FROM campaigns WHERE campaign_id = $1", [campaign_id]);
      return result.rowCount > 0;
  }
  },
};

module.exports = resolvers;
