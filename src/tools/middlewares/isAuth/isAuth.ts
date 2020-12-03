import { Context } from "@tools/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.req.session!.userId) throw new Error("not authenticated");
  return next();
};
