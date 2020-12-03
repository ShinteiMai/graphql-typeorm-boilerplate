import { User } from "@db/entity";
import { Errors } from "@tools/errors";
import { Context } from "@tools/types";
import { Query, Ctx, Resolver } from "type-graphql";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User | void> {
    const userId = ctx.req.session?.userId;
    if (!userId) {
      return Errors.UnauthorizedException();
    }

    return await User.findOne(userId);
  }
}
