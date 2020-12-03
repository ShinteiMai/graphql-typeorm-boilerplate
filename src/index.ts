import "reflect-metadata";

import * as path from "path";
import * as dotenv from "dotenv";
import cors from "cors";
import Express from "express";
import connectRedis from "connect-redis";
import session, { Store } from "express-session";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { createSchema, redis, setupTypeORMConnection } from "@utils/main";

const main = async () => {
  /** 0. ENV & Database Setup */
  dotenv.config({
    path: path.join(__dirname + `/../.env.${process.env.NODE_ENV}`),
  });
  await setupTypeORMConnection();

  /** 1. Apollo Server Setup */
  const schema = await createSchema();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    uploads: false,
    debug: !(process.env.NODE_ENV === "production"),
  });

  const app = Express();
  app.use(
    cors({
      credentials: true,
      /** Enter your client's origin here */
      origin: process.env.ORIGIN || `http://localhost:3000`,
    })
  );

  app.use(
    "/graphql",
    graphqlUploadExpress({
      maxFileSize: Number(process.env.MAX_FILE_SIZE) || 10000000,
      maxFiles: Number(process.env.MAX_FILES) || 10,
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  /** 2. Session Setup w/ Redis */
  //@ts-ignore
  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }) as Store,
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * Number(process.env.COOKIE_MAX_AGE),
      },
    })
  );

  app.listen(process.env.PORT || 8080, () => {
    console.log(
      `🚀 GraphQL API started on http://localhost:${
        process.env.PORT || 8080
      }/graphql`
    );
  });
};

main();
