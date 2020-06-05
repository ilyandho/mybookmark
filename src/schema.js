const { gql } = require('apollo-server');

const TypeDefs = gql`
  type Url {
    id: ID!
    url: String!
    title: String
    description: String
    image: String
    user: User!
    tags: [String!]
    createdAt: String!
    caption: String
    hearts: Int!
    hearters: [User!]
    favoriters: [User!]
  }
  type Token {
    token: String!
  }
  type User {
    id: ID!
    firstname: String!
    surname: String!
    username: String!
    password: String!
    email: String!
    bookmarks: [Url!]
    favoriteBookmarks: [Url!]
  }
  type Query {
    urls: [Url!]
    url(id: String!): Url!
    me: User!
  }

  type Mutation {
    addUrl(url: String!, caption: String, tags: [String!]): Url!
    updateUrl(id: String!, url: String, caption: String, tags: [String!]): Url!
    deleteUrl(id: String!): String!
    heartUrl(id: String!): Url!
    toggleFavorite(id: String!): Url!

    createUser(
      firstname: String!
      surname: String!
      username: String!
      password: String!
      email: String!
    ): User!

    login(username: String!, password: String!): Token!
  }
`;

module.exports = TypeDefs;
