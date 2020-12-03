import { User } from "@db/entity";
import { confirmUserPrefix } from "@utils/constants";
import { redis } from "@utils/main";
import { Mutation, Arg, Resolver } from "type-graphql";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<Boolean> {
    const userId = await redis.get(confirmUserPrefix + token);
    if (!userId) return false;

    await User.update({ id: userId }, { confirmed: true });
    await redis.del(token);

    return true;
  }
}
