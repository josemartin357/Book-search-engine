const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }
  type User {
    _id: ID
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Query {
    users: [User]
    user(_id: ID, username: String!): User
    me: User
  }
  type Auth {
    token: ID
    user: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      bookId: String!
      authors: [String]!
      description: String
      image: String
      link: String
      title: String!
    ): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
