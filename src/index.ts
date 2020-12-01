import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { createConnection } from "typeorm";
import session, { Store } from "express-session";
import connectRedis from "connect-redis";

import { redis } from "./redis";
import cors from "cors";
import { createSchema } from "./utils/createSchema";
import { graphqlUploadExpress } from "graphql-upload";
// import { graphqlHTTP } from "express-graphql";

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    uploads: false,
  });

  const app = Express();
  app.use(
    cors({
      credentials: true,
      origin: `http://localhost:3000`,
    })
  );

  const RedisStore = connectRedis(session as any);
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }) as Store,
      name: "qid",
      secret: "asdasdasdasd",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    })
  );

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log(`Server started on http://localhost:4000/graphql`);
  });
};

main();
