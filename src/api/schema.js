// src/graphql/schema.js

const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    auth0_id: String!
    wallet_address: String
    roles: [Role!]!
    contributions: [PropertyCampaign!]!
    secondaryMarketPurchases: [Transaction!]!
    rentedProperty: RentedProperty
    transactions: [Transaction!]!
    total_invested: Float
    total_tokens: Int
    stripe_customer_id: String
  }

  type Role {
    role_id: ID!
    name: String!
  }

  type RentedProperty {
    propertyCampaign: PropertyCampaign!
    monthlyRent: Float!
    duration: Int!
  }

  type PropertyCampaign {
    id: ID!
    description: String!
    localisation: String!
    total_value: Float!
    charges_estimation: Float
    energy_bill_estimation: Float
    construction_year: Int
    room_count: Int
    bedroom_count: Int
    floor_number: Int
    area: Float
    dpe: String
    ges: String
    goal_amount: Float
    current_amount: Float
    start_date: String
    end_date: String
    status: CampaignStatus!
    contributors: [User!]
    initial_deposit: Float
    renovation_cost: Float
    notary_fees: Float
    loan_amount: Float
    interest_cost: Float
    loan_duration: Int
    total_paid: Int
    total_remaining: Float
  }

  enum CampaignStatus {
    ONGOING
    COMPLETED
    FAILED
  }

  type Transaction {
    id: ID!
    user: User!
    amount: Float!
    type: TransactionType
    propertyCampaign: PropertyCampaign
    timestamp: String
  }

  enum TransactionType {
    INVESTMENT
    PAYMENT
    SECONDARY_MARKET_PURCHASE
  }

  type Query {
    getItems: [Item]
    getUserById(auth0_id: ID!): User
    getAllUsers: [User!]!
    getPropertyCampaign(id: ID!): PropertyCampaign
    getAllPropertyCampaigns: [PropertyCampaign!]!
    getTransactions: [Transaction]
  }

  type Mutation {
    createItem(name: String!): Item
    deleteItem(id: ID!): Item

    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): Boolean
    ensureUser(auth0Id: String, email: String, walletAddress: String): Boolean

    addUserRole(auth0_id: String!, roleName: String!): Boolean
    removeUserRole(auth0_id: String!, roleName: String!): Boolean

    createPropertyCampaign(input: PropertyCampaignInput!): PropertyCampaign
    updatePropertyCampaign(
      id: ID!
      input: PropertyCampaignInput!
    ): PropertyCampaign
    deletePropertyCampaign(id: ID!): Boolean

    createTransaction(input: TransactionInput!): Transaction
    updateTransaction(id: ID!, input: TransactionInput!): Transaction
    deleteTransaction(id: ID!): Boolean
  }

  input UserInput {
    username: String
    email: String
    auth0_id: String
    wallet_address: String
  }

  input PropertyCampaignInput {
    description: String
    localisation: String
    total_value: Float
    charges_estimation: Float
    energy_bill_estimation: Float
    construction_year: Int
    room_count: Int
    bedroom_count: Int
    floor_number: Int
    area: Float
    dpe: String
    ges: String
    goal_amount: Float
    current_amount: Float
    start_date: String
    end_date: String
    status: CampaignStatus
    initial_deposit: Float
    renovation_cost: Float
    notary_fees: Float
    loan_amount: Float
    interest_cost: Float
    loan_duration: Int
  }

  input TransactionInput {
    propertyCampaignId: ID!
    userId: ID!
    amount: Float!
  }
`

module.exports = typeDefs
