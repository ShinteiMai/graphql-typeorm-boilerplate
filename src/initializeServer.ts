import * as path from "path";
import * as fs from "fs";

import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";

import { initializeTypeorm } from "./utils/initializeTypeorm";
import { GraphQLSchema } from "graphql";

export const server = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));
  folders.forEach((folder) => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`)
    );

    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const stitchedSchemas: any = mergeSchemas({ schemas });
  const instance = new GraphQLServer({ schema: stitchedSchemas });

  await initializeTypeorm();
  const port = process.env.NODE_ENV === "testing" ? 0 : 4000;
  const app = await instance.start({ port });

  console.log(`GraphQL Server has started on http://localhost:${port}`);

  return app;
};
