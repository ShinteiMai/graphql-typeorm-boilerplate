import { Query, Ctx, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { Context } from "../../types/Context";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User | undefined> {
    console.log(ctx.req.session);
    //@ts-ignore
    const userId = ctx.req.session!.userId;
    console.log(`userId: ${userId}`);
    if (!userId) return undefined;

    return await User.findOne(userId);
  }
}
