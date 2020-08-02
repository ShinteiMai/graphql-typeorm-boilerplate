import * as Redis from "ioredis";
import fetch from "node-fetch";
import { Connection } from "typeorm";

import { createConfirmationLink } from "./createConfirmationLink";
import { initializeTypeorm } from "./initializeTypeorm";
import { User } from "../entity/User";

let userId: string;

let connection: Connection;
const redis = new Redis();

beforeAll(async () => {
  connection = await initializeTypeorm();
  const user = await User.create({
    email: "bob1@bob.com",
    password: "bobobobob",
  });
  await user.save();
  userId = user.id;
});

afterAll(async () => {
  await connection.close();
});

describe("Confirmation Email Link Test", () => {
  test("Make sure it can confirms user and clears the key in redis", async () => {
    const url = await createConfirmationLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );

    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual("ok");
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();

    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];

    const value = await redis.get(key);
    expect(value).toBeNull();
  });

  test("sends invalid back if bad id was sent", async () => {
    const response = await fetch(
      `${process.env.TEST_HOST as string}/confirm/1202139`
    );
    const text = await response.text();
    expect(text).toEqual("invalid user");
  });
});
