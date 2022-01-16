// DONE: Added necessary Query and Mutation types
// NOTE: Created an input type in saveBook mutation to handle all the parameters needed

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Query {
    users: [User]
    user(userId: ID!, username: String!): User
    me: User
  }

  type Auth {
    token: ID
    user: User
  }

  input bookInput {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: bookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;

// Note: using name bookData as defined in SearchBook.js
