// src/graphql/schema.js

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    user_id: Int!
    username: String!
    email: String!
    wallet_address: String
    role: String!
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
  }
`;

module.exports = typeDefs;
