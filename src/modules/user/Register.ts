import { Query, Mutation, Arg, UseMiddleware, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middlewares/isAuth";
import { logger } from "../middlewares/logger";
import { sendEmail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";

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
    const hashedPassword = await bcrypt.hash(password, 12);
    if (await User.findOne({ email })) {
      return null;
    }
    try {
      const user = new User();

      user.firstName = firstName;
      user.lastName = lastName;
      user.password = hashedPassword;
      user.email = email;

      await user.save();

      await sendEmail(email, await createConfirmationUrl(user.id));

      return user;
    } catch (err) {
      return null;
    }
  }
}
