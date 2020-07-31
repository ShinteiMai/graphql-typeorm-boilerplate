import { ResolverMap } from "./types/graphql-utils";

import * as bcrypt from "bcryptjs";
import { User } from "./entity/User";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: any) => `Hello, ${name || "Stranger"}!`,
  },
  Mutation: {
      register: async (_, { email, password }) => {
          const hashedPassword = await bcrypt.hash(password, 12);
          const user = await User.create({
            email,
            password: hashedPassword
          });
          await user.save();
          return true;
      }
  }
};
