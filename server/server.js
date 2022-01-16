// NOTES: needed to install: npm install apollo-server graphql
// NOTES: had to run "npm install @apollo/client graphql" and "npm i graphql@15.8.0 -E"
// TO RUN: npm i from the root folder, then npm run build, then npm run develop

const express = require("express");
const path = require("path");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");
// Requiring Apollo Server
const { ApolloServer } = require("apollo-server-express");
// Requiring schemas: typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const app = express();
const PORT = process.env.PORT || 3001;

// Setting-up ApolloServer
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: authMiddleware,
// });

// // Setting-up middleware
// server.applyMiddleware({ app });

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();

  server.applyMiddleware({ app });
  return server;
};

// const server = startServer();

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

db.once("open", async () => {
  server = await startServer();
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
