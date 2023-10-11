// src/graphql/resolvers.js
const { v4: uuidv4 } = require('uuid')
const pool = require('../config/database')
const stripe = require('../config/stripe')
const cloudinary = require('../config/cloudinary')

const resolvers = {
  Query: {
    async getItems() {
      const result = await pool.query('SELECT * FROM items')
      return result.rows
    },
    getUserById: async (_, { auth0_id }) => {
      // récupérer l'utilisateur basé sur auth0_id
      const user = await pool.query('SELECT * FROM users WHERE auth0_id = $1', [
        auth0_id,
      ])

      // vérifiez si l'utilisateur existe
      if (user.rows.length === 0) {
        throw new Error('User not found')
      }

      // récupérer les rôles de l'utilisateur
      const roles = await pool.query(
        'SELECT r.* FROM roles r JOIN user_roles ur ON r.role_id = ur.role_id WHERE ur.user_id = $1',
        [user.rows[0].user_id],
      )

      // retourner l'utilisateur et ses rôles
      return {
        ...user.rows[0],
        roles: roles.rows,
      }
    },

    async getAllUsers() {
      const result = await pool.query('SELECT * FROM users')
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

    async getTransactions() {
      const result = await pool.query('SELECT * FROM transactions')
      return result.rows
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
      // Récupérez l'ID de l'utilisateur
      const user = (
        await pool.query('SELECT user_id FROM users WHERE auth0_id = $1', [
          auth0_id,
        ])
      ).rows[0]

      if (!user) {
        throw new Error('User not found')
      }

      // Récupérez l'ID du rôle
      const role = (
        await pool.query('SELECT role_id FROM roles WHERE name = $1', [
          roleName,
        ])
      ).rows[0]

      if (!role) {
        throw new Error('Role not found')
      }

      // Vérifiez si le rôle existe déjà pour l'utilisateur
      const existingRole = (
        await pool.query(
          'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2',
          [user.user_id, role.role_id],
        )
      ).rows[0]

      if (existingRole) {
        throw new Error('Role already exists for this user')
      }

      // Ajoutez le rôle à l'utilisateur
      await pool.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
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
      const result = await pool.query(
        'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
        [user.user_id, role.role_id],
      )

      // Vérifiez si le rôle a été supprimé
      if (result.rowCount === 0) {
        throw new Error('Role was not found for this user')
      }

      return true
    },
    async createPropertyCampaign(_, { input }) {
      try {
        // Uploadez l'image sur Cloudinary si elle est fournie
        if (input.image) {
          const result = await cloudinary.uploader.upload(input.image)
          input.image_url = result.secure_url // Utilisez l'URL sécurisée pour stocker en base de données
          delete input.image // Supprimez l'image d'entrée originale, nous n'en avons plus besoin
        }
        const values = Object.values(input)
        const query = `INSERT INTO property_campaigns (${Object.keys(
          input,
        ).join(', ')}) VALUES (${values
          .map((_, idx) => `$${idx + 1}`)
          .join(', ')}) RETURNING *`
        const result = await pool.query(query, values)
        return result.rows[0]
      } catch (error) {
        console.error(
          "Erreur lors de l'upload de l'image ou de l'insertion dans la DB",
          error,
        )
        throw new Error('Erreur lors de la création de la campagne')
      }
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
    async createTransaction(_, { input }) {
      const { propertyCampaignId, userId, amount, type, referrerId } = input
      const timestamp = new Date().toISOString()
      const id = uuidv4()
      const query = `
        INSERT INTO transactions (id, property_campaign_id, user_id, amount, type, referrer_id timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`
      const values = [id, propertyCampaignId, userId, amount, type, referrerId, timestamp]
      const result = await pool.query(query, values)

      // Vérifiez si une ligne a été retournée.
      if (result.rows.length === 0) {
        throw new Error('Transaction could not be created.')
      }

      const transaction = result.rows[0]

      // Récupérez les informations de l'utilisateur.
      const userQuery = `SELECT * FROM users WHERE user_id = $1`
      const userResult = await pool.query(userQuery, [transaction.user_id])

      // Vérifiez si l'utilisateur existe.
      if (userResult.rows.length === 0) {
        throw new Error('User does not exist.')
      }

      transaction.user = userResult.rows[0]

      if (transaction.referrer_id) {
        // TODO : Logique de récompense pour l'utilisateur avec l'ID referrer_id.
        console.log("Transaction réaliser via une recommandatio !!", transaction.referrer_id)
      }

      return transaction
    },
    async updateTransaction(_, { id, input }) {
      const fields = Object.keys(input).map(
        (key, index) => `${key} = $${index + 1}`,
      )
      const values = Object.values(input).concat(id)
      const query = `UPDATE transactions SET ${fields.join(', ')} WHERE id = $${
        values.length
      } RETURNING *`
      const result = await pool.query(query, values)

      if (result.rows.length === 0) {
        throw new Error('Transaction could not be updated.')
      }

      return result.rows[0]
    },
    async deleteTransaction(_, { id }) {
      const result = await pool.query(
        'DELETE FROM transactions WHERE id = $1 RETURNING *',
        [id],
      )

      if (result.rows.length === 0) {
        throw new Error('Transaction could not be deleted.')
      }

      return true
    },
    ensureUser: async (_, { auth0Id, email, walletAddress, referrerId }) => {
      try {
        let user
        console.log('auth0Id', auth0Id)
        console.log('email', email)
        console.log('walletAddress', walletAddress)
        console.log('referrerId', referrerId)

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
            'INSERT INTO users (username, email, auth0_id, wallet_address, referrer_id) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
            [name, userEmail, auth0Id, walletAddress, referrerId],
          )

          const investorRole = 'INVESTOR'
          // Get the role_id for the 'INVESTOR' role
          const roleRes = await pool.query(
            'SELECT role_id FROM roles WHERE name = $1',
            [investorRole]
          );

          if (roleRes.rows.length > 0) {
            const roleId = roleRes.rows[0].role_id;

            // Insert the user_id and role_id into the user_roles table
            await pool.query(
                'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
                [newUser.rows[0].user_id, roleId],
            );
          } else {
            console.error("Role 'INVESTOR' not found in the roles table.");
          }

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
          if (referrerId) {
            // Enregistrez referrerId en base de données avec les autres détails de l'utilisateur.
            // TODO : Logique de récompense pour l'utilisateur avec l'ID referrer_id.
            console.log("Creation d'un nouvel utilisateur grace à une recommandation", referrerId);
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
