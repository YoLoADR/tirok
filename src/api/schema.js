// src/graphql/schema.js

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Role {
    role_id: Int!
    name: String!
  }

  type User {
    user_id: Int!
    username: String!
    email: String!
    wallet_address: String
    roles: [Role!]!
    total_invested: Float
    total_tokens: Int
    auth0_id: String!
    contributions: [Contribution!]!
    properties: [Property!]!
    transactions: [Transaction!]!
  }

  type Contribution {
    contribution_id: Int!
    campaign_id: Int!
    investor_id: Int!
    amount: Float!
    tokens_received: Int
    timestamp: String
    campaign: Campaign
    investor: User
  }
  
  type Token {
    token_id: Int!
    property_id: Int!
    owner_id: Int!
    token_value: Float!
    token_symbol: String
    total_supply: Int
    tokens_in_circulation: Int
    token_contract_address: String
    property: Property
    owner: User
  }
  
  type ROI {
    roi_id: Int
    investor_id: Int
    property_id: Int
    year: Int
    amount: Float
    timestamp: String
    investor: User
    property: Property
  }
  
  type UserRole {
    user_id: Int!
    role_id: Int!
  }


  type Property {
    property_id: Int!
    seller_id: Int!
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
    campaign_end_date: String
    status: String
    current_investor_share: Float
    current_acquirer_share: Float
    campaigns: [Campaign!]!
    tokens: [Token!]!
    roi: [ROI!]!
  }

  type Campaign {
    campaign_id: Int!
    property_id: Int!
    goal_amount: Float
    current_amount: Float
    start_date: String
    end_date: String
    status: String
    stripe_account_id: String
    contributions: [Contribution!]!
    property: Property
    tokens: [Token!]!
    roi: ROI  
    financialDetails: [FinancialDetail]  
  }

  type Transaction {
    transaction_id: Int!
    sender_id: Int!
    receiver_id: Int!
    token_id: Int!
    amount: Int!
    timestamp: String
    sender: User
    receiver: User
    token: Token
  }

  type Payment {
    payment_id: Int!
    acquirer_id: Int!
    property_id: Int!
    amount_paid: Float!
    payment_date: String
    timestamp: String
    remaining_amount: Float
    modulated_amount: Float
    acquirer: User
    property: Property
  }

  type Modulation {
    modulation_id: Int!
    acquirer_id: Int!
    property_id: Int!
    new_monthly_amount: Float!
    reason: String
    timestamp: String
    acquirer: User
    property: Property
  }

  type FinancialDetail {
    financial_id: Int!
    acquirer_id: Int!
    initial_deposit: Float!
    renovation_cost: Float!
    notary_fees: Float!
    loan_amount: Float!
    interest_cost: Float!
    loan_duration: Int!
    total_paid: Float!
    total_remaining: Float!
    acquirer: User
  }
  

  type Query {
    getProperty(property_id: Int!): Property
    getAllProperties: [Property!]!
    getCampaign(campaign_id: Int!): Campaign
    getAllCampaigns: [Campaign!]!
    getAllCampaignsWithDetails: [Campaign!]!
    getCampaignWithDetails(campaign_id: Int!): Campaign
    getUserById(auth0_id: String!): User
  }

  type Mutation {
      createProperty(input: PropertyInput!): Property
      updateProperty(property_id: Int!, input: PropertyInput!): Property
      deleteProperty(property_id: Int!): Boolean

      createCampaign(input: CampaignInput!): Campaign
      updateCampaign(campaign_id: Int!, input: CampaignInput!): Campaign
      deleteCampaign(campaign_id: Int!): Boolean

      ensureUser(auth0Id: String, email: String, walletAddress: String): Boolean
      
      updateUser(auth0_id: String!, username: String, email: String, wallet_address: String, role: String): User
      deleteUser(auth0_id: String!): Boolean
      addUserRole(auth0_id: String!, roleName: String!): Boolean
      removeUserRole(auth0_id: String!, roleName: String!): Boolean
  }

  input PropertyInput {
    seller_id: Int!
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
    campaign_end_date: String
    status: String
    current_investor_share: Float
    current_acquirer_share: Float
  }

  input CampaignInput {
    property_id: Int!
    goal_amount: Float
    current_amount: Float
    start_date: String
    end_date: String
    status: String
  }
`;

module.exports = typeDefs;
