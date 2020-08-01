import "reflect-metadata";

import * as path from "path";

import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";

import { resolvers } from "./resolvers";
import { initializeTypeorm } from "./utils/initializeTypeorm";

export const server = async () => {
  const typeDefs = importSchema(path.join(__dirname, "schema.graphql"));

  const instance = new GraphQLServer({ typeDefs, resolvers });

  await initializeTypeorm();
  await instance.start();
  console.log("GraphQL Server has started on http://localhost:4000");
};

server();
