import { buildSchema } from "type-graphql";

export const createSchema = () =>
  /**
   * This will build all the GraphQL Schema based on all resolvers under the src/modules/* folder
   */
  buildSchema({
    resolvers: [__dirname + "/../modules/*/*.ts"],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
