import * as argon2 from "argon2";
import { Query, Mutation, Arg, UseMiddleware, Resolver } from "type-graphql";
import { RegisterInput } from "./input/RegisterInput";
import { createConfirmationUrl, sendEmail } from "@utils/user";
import { isAuth, logger } from "@tools/middlewares";
import { User } from "@db/entity";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => String, { nullable: true })
  async hello() {
    return "Hello World!";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User | null> {
    if (await User.findOne({ email })) {
      return null;
    }
    try {
      const user = new User();

      user.firstName = firstName;
      user.lastName = lastName;
      user.password = await argon2.hash(password);
      user.email = email;

      await user.save();

      await sendEmail(email, await createConfirmationUrl(user.id));

      return user;
    } catch (err) {
      return null;
    }
  }
}
