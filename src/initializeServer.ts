import * as path from "path";
import * as fs from "fs";

import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";

import * as Redis from "ioredis";

import { initializeTypeorm } from "./utils/initializeTypeorm";
import { GraphQLSchema } from "graphql";
import { User } from "./entity/User";

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

  const redis = new Redis();

  const stitchedSchemas: any = mergeSchemas({ schemas });
  const instance = new GraphQLServer({
    schema: stitchedSchemas,
    context: ({ request }) => {
      return { redis, url: request.protocol + "://" + request.get("host") };
    },
  });

  instance.express.get("/confirm/:id", async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id);

    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(id);
      res.send("ok");
    } else {
      res.send("invalid user");
    }
  });

  await initializeTypeorm();
  const port = process.env.NODE_ENV === "testing" ? 0 : 4000;
  const app = await instance.start({ port });

  console.log(`GraphQL Server has started on http://localhost:${port}`);

  return app;
};
