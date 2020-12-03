import { User } from "@db/entity";
import { Context } from "@tools/types";
import { Query, Ctx, Resolver } from "type-graphql";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User | undefined> {
    const userId = ctx.req.session?.userId;
    if (!userId) {
      throw new Error("Not Authenticated");
    }

    return await User.findOne(userId);
  }
}
