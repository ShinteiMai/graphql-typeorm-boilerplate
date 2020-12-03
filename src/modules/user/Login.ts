import * as argon2 from "argon2";
import { Mutation, Arg, Ctx, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { LoginInput } from "./login/LoginInput";
import { Context } from "../../types/Context";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("data") { email, password }: LoginInput,
    @Ctx() ctx: Context
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) return null;
    const isValid = await argon2.verify(user.password, password);
    if (!isValid) return null;
    if (!user.confirmed) return null;

    ctx.req.session!.userId = user.id;
    console.log(ctx.req.session);
    return user;
  }
}
