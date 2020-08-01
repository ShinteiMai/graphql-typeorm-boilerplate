import * as bcrypt from "bcryptjs";

import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";

export const resolvers: ResolverMap = {
  Query: {
    default: () => "Default query for GraphQL",
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const existingUser = await User.findOne({
        where: { email },
        select: ["id"],
      });
      if (existingUser) {
          return [
              {
                  path: "email",
                  message: "email already taken"
              }
          ]
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({
        email,
        password: hashedPassword,
      });
      await user.save();

      return null;
    },
  },
};
