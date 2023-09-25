// src/graphql/resolvers.js

const pool = require('../config/database')
const stripe = require('../config/stripe')

const resolvers = {
  Query: {
    async getItems() {
      const result = await pool.query('SELECT * FROM items')
      return result.rows
    },
    getUserById: async (_, { auth0_id }) => {
      const user = await pool.query('SELECT * FROM users WHERE auth0_id = $1', [
        auth0_id,
      ])
      const roles = await pool.query(
        'SELECT r.* FROM roles r JOIN user_roles ur ON r.role_id = ur.role_id WHERE ur.user_id = $1',
        [user.rows[0].user_id],
      )
      return {
        ...user.rows[0],
        roles: roles.rows,
      }
    },

    async getAllUsers() {
      const result = await pool.query('SELECT * FROM users')
      return result.rows
    },
    async getTransactions() {
      const result = await pool.query('SELECT * FROM transactions')
      return result.rows
    },
    getPropertyCampaign: async (_, { id }) => {
      const campaign = await pool.query(
        'SELECT * FROM property_campaigns WHERE id = $1',
        [id],
      )
      return campaign.rows[0]
    },
    getAllPropertyCampaigns: async () => {
      const campaigns = await pool.query('SELECT * FROM property_campaigns')
      return campaigns.rows
    },
  },
  Mutation: {
    async createItem(_, { name }) {
      const result = await pool.query(
        'INSERT INTO items(name) VALUES($1) RETURNING *',
        [name],
      )
      return result.rows[0]
    },
    async deleteItem(_, { id }) {
      const result = await pool.query(
        'DELETE FROM items WHERE id=$1 RETURNING *',
        [id],
      )
      return result.rows[0]
    },
    updateUser: async (_, args) => {
      const { auth0_id, ...updateFields } = args

      if (Object.keys(updateFields).length === 0) {
        throw new Error('No fields to update')
      }

      const fields = Object.keys(updateFields).map(
        (key, index) => `${key} = $${index + 1}`,
      )
      const values = Object.values(updateFields).concat(auth0_id)

      const query = `UPDATE users SET ${fields.join(', ')} WHERE auth0_id = $${
        values.length
      } RETURNING *`

      const result = await pool.query(query, values)
      return result.rows[0]
    },
    deleteUser: async (_, { auth0_id }) => {
      const result = await pool.query(
        'DELETE FROM users WHERE auth0_id = $1 RETURNING *',
        [auth0_id],
      )

      if (result.rows.length === 0) {
        throw new Error('User not found')
      }

      return true
    },
    addUserRole: async (_, { auth0_id, roleName }) => {
      // Récupérez l'ID de l'utilisateur et l'ID du rôle ('visitor'), ('seller'), ('investor'), ('buyer');
      const user = (
        await pool.query('SELECT user_id FROM users WHERE auth0_id = $1', [
          auth0_id,
        ])
      ).rows[0]
      const role = (
        await pool.query('SELECT role_id FROM roles WHERE name = $1', [
          roleName,
        ])
      ).rows[0]

      if (!user || !role) {
        throw new Error('User or role not found')
      }

      // Ajoutez le rôle à l'utilisateur
      await pool.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [user.user_id, role.role_id],
      )

      return true
    },
    removeUserRole: async (_, { auth0_id, roleName }) => {
      // Récupérez l'ID de l'utilisateur et l'ID du rôle
      const user = (
        await pool.query('SELECT user_id FROM users WHERE auth0_id = $1', [
          auth0_id,
        ])
      ).rows[0]
      const role = (
        await pool.query('SELECT role_id FROM roles WHERE name = $1', [
          roleName,
        ])
      ).rows[0]

      if (!user || !role) {
        throw new Error('User or role not found')
      }

      // Supprimez le rôle de l'utilisateur
      await pool.query(
        'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
        [user.user_id, role.role_id],
      )

      return true
    },
    async createTransaction(_, { input }) {
      const { propertyCampaignId, userId, amount } = input
      const query = `
        INSERT INTO transactions (property_campaign_id, user_id, amount)
        VALUES ($1, $2, $3)
        RETURNING *`
      const values = [propertyCampaignId, userId, amount]
      const result = await pool.query(query, values)
      return result.rows[0]
    },
    async updateTransaction(_, { transaction_id, input }) {
      const fields = Object.keys(input).map(
        (key, index) => `${key} = $${index + 1}`,
      )
      const values = Object.values(input).concat(transaction_id)
      const query = `UPDATE transactions SET ${fields.join(
        ', ',
      )} WHERE transaction_id = $${values.length} RETURNING *`
      const result = await pool.query(query, values)
      return result.rows[0]
    },
    async deleteTransaction(_, { transaction_id }) {
      const result = await pool.query(
        'DELETE FROM transactions WHERE transaction_id = $1',
        [transaction_id],
      )
      return result.rowCount > 0
    },
    async createPropertyCampaign(_, { input }) {
      const values = Object.values(input)
      const query = `INSERT INTO property_campaigns (${Object.keys(input).join(
        ', ',
      )}) VALUES (${values
        .map((_, idx) => `$${idx + 1}`)
        .join(', ')}) RETURNING *`
      const result = await pool.query(query, values)
      return result.rows[0]
    },
    updatePropertyCampaign: async (_, { id, input }) => {
      const fields = Object.keys(input).map(
        (key, index) => `${key} = $${index + 1}`,
      )
      const values = Object.values(input).concat(id)
      const query = `UPDATE property_campaigns SET ${fields.join(
        ', ',
      )} WHERE id = $${values.length} RETURNING *`
      const result = await pool.query(query, values)
      return result.rows[0]
    },
    deletePropertyCampaign: async (_, { id }) => {
      const result = await pool.query(
        'DELETE FROM property_campaigns WHERE id = $1 RETURNING *',
        [id],
      )
      return result.rowCount > 0
    },
    ensureUser: async (_, { auth0Id, email, walletAddress }) => {
      try {
        let user
        console.log('auth0Id', auth0Id)
        console.log('email', email)
        console.log('walletAddress', walletAddress)

        if (auth0Id) {
          user = await pool.query('SELECT * FROM users WHERE auth0_id = $1', [
            auth0Id,
          ])
        } else if (walletAddress) {
          user = await pool.query(
            'SELECT * FROM users WHERE wallet_address = $1',
            [walletAddress],
          )
        }

        if (user.rows.length === 0) {
          //TEMP : sans adresse email on met la wallet adresse en base
          const name = walletAddress ? walletAddress : email.split('@')[0]
          const userEmail = email || `${walletAddress}@placeholder.com`

          const newUser = await pool.query(
            'INSERT INTO users (username, email, auth0_id, wallet_address) VALUES ($1, $2, $3, $4) RETURNING user_id',
            [name, userEmail, auth0Id, walletAddress],
          )

          const visitorRoleId = (
            await pool.query("SELECT role_id FROM roles WHERE name = 'visitor'")
          ).rows[0].role_id
          await pool.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
            [newUser.rows[0].user_id, visitorRoleId],
          )

          if (auth0Id) {
            const customer = await stripe.customers.create({
              email: email,
              name: name,
            })

            await pool.query(
              'UPDATE users SET stripe_customer_id = $1 WHERE user_id = $2',
              [customer.id, newUser.rows[0].user_id],
            )
          }

          return true // utilisateur créé avec succès
        }

        return false // utilisateur déjà existant
      } catch (error) {
        console.error(
          "Erreur lors de la création/mise à jour de l'utilisateur:",
          error,
        )
        throw new Error(
          "Erreur lors de la création/mise à jour de l'utilisateur.",
        )
      }
    },
  },
}

module.exports = resolvers
