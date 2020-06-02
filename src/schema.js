const { gql } = require('apollo-server');

const TypeDefs = gql`
  type Url {
    id: ID!
    url: String!
    title: String
    description: String
    imageUrl: String
    favorite: Boolean!
    user: String
    tags: [String!]
  }

  type Query {
    urls: [Url!]
  }
`;

module.exports = TypeDefs;
