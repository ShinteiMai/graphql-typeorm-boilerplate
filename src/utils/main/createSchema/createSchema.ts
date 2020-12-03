import { buildSchema } from "type-graphql";
import * as path from "path";

/**
 * This will build all the GraphQL Schema based on all resolvers under the src/modules/* folder
 */
export const createSchema = () => {
  const modulesPath = path.join(__dirname + "/../../../modules/*/*.ts");
  return buildSchema({
    resolvers: [modulesPath],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
};
