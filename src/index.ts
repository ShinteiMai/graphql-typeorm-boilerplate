import "reflect-metadata";

import * as path from "path";

import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import { createConnection } from "typeorm";

const typeDefs = importSchema(path.join(__dirname, "schema.graphql"));

const server = new GraphQLServer({ typeDefs, resolvers });

createConnection().then(() => {
  server.start(() => {
    console.log("GraphQL Server has started on http://localhost:4000");
  });
});
