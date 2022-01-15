const { gql } = require("apollo-server-express");

// Added necessary Query and Mutation types
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
    bookCount: int
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
    saveBook(input: bookInput): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
