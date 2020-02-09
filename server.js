const { ApolloServer } = require("apollo-server");

require("dotenv").config();
const db = require("./config/db");
const { findOneOrUpdate } = require("./controllers/user");
db();

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let accessToken;
    let currentUser;
    try {
      accessToken = req.headers.authorization;
      if (accessToken) {
        currentUser = await findOneOrUpdate(accessToken);
      }
    } catch (error) {
      console.log(error.message);
    }
    return { currentUser };
  }
});

server.listen().then(({ url }) => console.log(`server is listening at ${url}`));
