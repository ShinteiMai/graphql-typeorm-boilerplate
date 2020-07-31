import "reflect-metadata";

import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
    type Query {
        hello(name: String): String!
    }
`;

const resolvers = {
  Query: {
    hello: (_: any, { name }: any) => `Hello, ${name || "Stranger"}!`,
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
    console.log("GraphQL Server has started on http://localhost:4000");
});
