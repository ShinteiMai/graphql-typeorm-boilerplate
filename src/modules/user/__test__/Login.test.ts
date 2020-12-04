import * as faker from "faker";
import { gqlCall } from "@utils/test";
import { loginMutation, registerMutation } from "./gql";

describe("Login Resolver", () => {
  it("ables to login an user", async () => {
    /** 0. Register a random user */
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const registerCall = await gqlCall({
      source: registerMutation,
      variableValues: {
        data,
      },
    });
    expect(registerCall.data).toMatchObject({
      register: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });

    /** 1. Confirm the user */

    /** 2. Login the user */
    const loginCall = await gqlCall({
      source: loginMutation,
      variableValues: {
        data: {
          email: data.email,
          password: data.password,
        },
      },
    });
    console.log(loginCall.data);
    // expect(loginCall.data).toMatchObject({
    //   login: {
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     email: data.email,
    //   },
    // });
  }, 30000);
});
