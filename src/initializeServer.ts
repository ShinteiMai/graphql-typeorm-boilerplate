import { GraphQLServer } from "graphql-yoga";
import { mergeSchemas } from "graphql-tools";

import { initializeTypeorm } from "./utils/initializeTypeorm";
import { redis } from "./redis";

import { confirmEmail } from "./routes/confirmEmail";
import { generateSchema } from "./utils/generateSchema";

export const server = async () => {
  const schemas = generateSchema();
  const stitchedSchemas: any = mergeSchemas({ schemas });
  const instance = new GraphQLServer({
    schema: stitchedSchemas,
    context: ({ request }) => {
      return { redis, url: request.protocol + "://" + request.get("host") };
    },
  });

  instance.express.get("/confirm/:id", confirmEmail);

  await initializeTypeorm();
  const port = process.env.NODE_ENV === "testing" ? 0 : 4000;
  const app = await instance.start({ port });

  console.log(`GraphQL Server has started on http://localhost:${port}`);

  return app;
};
