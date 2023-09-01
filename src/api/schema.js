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
  }

  type Query {
    getUserById(auth0_id: String!): User
  }

  type Mutation {
    updateUser(auth0_id: String!, username: String, email: String, wallet_address: String, role: String): User
    deleteUser(auth0_id: String!): Boolean
    addUserRole(auth0_id: String!, roleName: String!): Boolean
    removeUserRole(auth0_id: String!, roleName: String!): Boolean
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
  }

  type Campaign {
    campaign_id: Int!
    property_id: Int
    goal_amount: Float
    current_amount: Float
    start_date: String
    end_date: String
    status: String
  }
  

  type Query {
    getProperty(property_id: Int!): Property
    getAllProperties: [Property!]!
    getCampaign(campaign_id: Int!): Campaign
    getAllCampaigns: [Campaign!]!
  }

  type Mutation {
      createProperty(input: PropertyInput!): Property
      updateProperty(property_id: Int!, input: PropertyInput!): Property
      deleteProperty(property_id: Int!): Boolean

      createCampaign(input: CampaignInput!): Campaign
      updateCampaign(campaign_id: Int!, input: CampaignInput!): Campaign
      deleteCampaign(campaign_id: Int!): Boolean
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
      property_id: Int
      goal_amount: Float
      current_amount: Float
      start_date: String
      end_date: String
      status: String
  }
`;

module.exports = typeDefs;
