import { User } from "@db/entity";
import { Context } from "@tools/types";
import * as argon2 from "argon2";
import { Mutation, Arg, Ctx, Resolver } from "type-graphql";
import { LoginInput } from "./input/LoginInput";

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
