const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

// resolvers.js: Define the query and mutation functionality to work with the Mongoose models.
// With a resolver we populate the data for a GraphQL query
const resolvers = {
  Query: {
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate(
          "savedBooks"
        );
        // ANOTHER WAY: Some online users say they have used the versionKey from mongoose "__v"
        // return await User.findOne({ _id: context.user._id }).select(
        //   "-__v -password"
        // );
      }
      throw new AuthenticationError("Please log-in");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect Password");
      }
      const token = signToken(user);
      return { token, user };
    },
    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    saveBook: async (parent, { bookData }, context) => {
      // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
      if (context.user) {
        const updateUserBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: bookData,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return updateUserBooks;
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },
    // Set up mutation so a logged in user can only remove a book from their `savedBooks` and no one else's
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { savedBooks: { bookId } },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
