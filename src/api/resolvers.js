// src/graphql/resolvers.js

const pool = require('../config/database');
const stripe = require('../config/stripe');

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
    getAllCampaignsWithDetails: async () => {
      const campaigns = await pool.query("SELECT * FROM campaigns");
      const detailedCampaigns = await Promise.all(campaigns.rows.map(async (campaign) => {
        const contributions = await pool.query("SELECT * FROM contributions WHERE campaign_id = $1", [campaign.campaign_id]);
        const property = await pool.query("SELECT * FROM properties WHERE property_id = $1", [campaign.property_id]);
        const tokens = await pool.query("SELECT * FROM tokens WHERE property_id = $1", [campaign.property_id]);
        const roi = await pool.query("SELECT * FROM roi WHERE property_id = $1", [campaign.property_id]);
        return {
          ...campaign,
          contributions: contributions.rows,
          property: property.rows[0],
          tokens: tokens.rows,
          roi: roi.rows[0],
        };
      }));
      return detailedCampaigns;
    },
    getCampaignWithDetails: async (_, { campaign_id }) => {
      const campaign = await pool.query("SELECT * FROM campaigns WHERE campaign_id = $1", [campaign_id]);
      if (campaign.rows.length === 0) {
        throw new Error("Campaign not found");
      }
      const contributions = await pool.query("SELECT * FROM contributions WHERE campaign_id = $1", [campaign_id]);
      const property = await pool.query("SELECT * FROM properties WHERE property_id = $1", [campaign.rows[0].property_id]);
      const tokens = await pool.query("SELECT * FROM tokens WHERE property_id = $1", [campaign.rows[0].property_id]);
      const roi = await pool.query("SELECT * FROM roi WHERE property_id = $1", [campaign.rows[0].property_id]);
    
      return {
        ...campaign.rows[0],
        contributions: contributions.rows,
        property: property.rows[0],
        tokens: tokens.rows,
        roi: roi.rows[0],
      };
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
      // Insérer la nouvelle campagne dans la base de données
      const values = Object.values(input);
      const query = `INSERT INTO campaigns (${Object.keys(input).join(", ")}) VALUES (${values.map((_, idx) => `$${idx + 1}`).join(", ")}) RETURNING *`;
      const result = await pool.query(query, values);
      const newCampaign = result.rows[0];
    
      // Créer un compte Stripe
      const account = await stripe.accounts.create({
        type: 'express',
      });
    
      // Mettre à jour la table campaigns avec le stripe_account_id
      await pool.query("UPDATE campaigns SET stripe_account_id = $1 WHERE campaign_id = $2", [account.id, newCampaign.campaign_id]);
    
      // Retourner la nouvelle campagne avec l'ID du compte Stripe
      return {
        ...newCampaign,
        stripe_account_id: account.id,
      };
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
    },
    ensureUser: async (_, { auth0Id, email, walletAddress }) => {
      try {
          let user;
          console.log("auth0Id", auth0Id);
          console.log("email", email);
          console.log("walletAddress", walletAddress);
  
          if (auth0Id) {
              user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [auth0Id]);
          } else if (walletAddress) {
              user = await pool.query("SELECT * FROM users WHERE wallet_address = $1", [walletAddress]);
          }
  
          if (user.rows.length === 0) {
              //TEMP : sans adresse email on met la wallet adresse en base 
              const name = walletAddress ? walletAddress : email.split('@')[0];
              const userEmail = email || `${walletAddress}@placeholder.com`;

              const newUser = await pool.query(
                  "INSERT INTO users (username, email, auth0_id, wallet_address) VALUES ($1, $2, $3, $4) RETURNING user_id",
                  [name, userEmail, auth0Id, walletAddress]
              );
  
              const visitorRoleId = (await pool.query("SELECT role_id FROM roles WHERE name = 'visitor'")).rows[0].role_id;
              await pool.query(
                  "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
                  [newUser.rows[0].user_id, visitorRoleId]
              );
  
              if (auth0Id) {
                  const customer = await stripe.customers.create({
                      email: email,
                      name: name,
                  });
  
                  await pool.query("UPDATE users SET stripe_customer_id = $1 WHERE user_id = $2", [customer.id, newUser.rows[0].user_id]);
              }
  
              return true; // utilisateur créé avec succès
          }
  
          return false; // utilisateur déjà existant
      } catch (error) {
          console.error("Erreur lors de la création/mise à jour de l'utilisateur:", error);
          throw new Error("Erreur lors de la création/mise à jour de l'utilisateur.");
      }
    }
  },
};

module.exports = resolvers;
