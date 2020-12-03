import * as argon2 from "argon2";
import { Mutation, Arg, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { ChangePasswordInput } from "./changePassword/changePasswordInput";
import { forgotPasswordPrefix } from "../constants/confirmationPrefix";
import { redis } from "../../redis";

// import { Context } from "../../types/Context";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);
    if (!userId) return null;

    const user = await User.findOne(userId);
    if (!user) return null;

    await redis.del(forgotPasswordPrefix + token);

    user.password = await argon2.hash(password);
    await user.save();

    return user;
  }
}
