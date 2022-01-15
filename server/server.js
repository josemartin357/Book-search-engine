// DONE
// NOTES: needed to install: npm install apollo-server graphql
// TO RUN: npm from the root folder, then npm run develop

const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");
// Requiring Apollo Server
const { ApolloServer } = require("apollo-server-express");
// Requiring schemas: typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const app = express();
const PORT = process.env.PORT || 3001;

// Setting-up ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Setting-up middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Since the React front-end application will handle its own routing, we set up a wildcard route on our server that will serve the front end whenever a request for a non-API route is received.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
