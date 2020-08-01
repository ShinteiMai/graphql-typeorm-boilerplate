import * as path from "path";

import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";

import { resolvers } from "./resolvers";
import { initializeTypeorm } from "./utils/initializeTypeorm";

export const server = async () => {
  const typeDefs = importSchema(path.join(__dirname, "schema.graphql"));

  const instance = new GraphQLServer({ typeDefs, resolvers });

  await initializeTypeorm();
  const port = process.env.NODE_ENV === "testing" ? 0 : 4000;
  const app = await instance.start({ port });

  console.log(`GraphQL Server has started on http://localhost:${port}`);

  return app;
};