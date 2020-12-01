import { Mutation, Arg, Resolver } from "type-graphql";
import { redis } from "../../redis";
import { User } from "../../entity/User";
import { confirmUserPrefix } from "../constants/confirmationPrefix";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<Boolean> {
    console.log(token);
    const userId = await redis.get(confirmUserPrefix + token);
    console.log(userId);
    if (!userId) return false;

    await User.update({ id: userId }, { confirmed: true });
    await redis.del(token);

    return true;
  }
}