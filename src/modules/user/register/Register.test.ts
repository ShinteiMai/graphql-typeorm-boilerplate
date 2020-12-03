import * as faker from "faker";
import * as argon2 from "argon2";
import { User } from "../../../entity/User";
import { Connection } from "typeorm";
import { gqlCall } from "../../../test-utils/gqlCall";
import { setupTypeORMConnection } from "../../../utils/setupTypeORMConnection";

let conn: Connection;

beforeAll(async () => {
  conn = await setupTypeORMConnection();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
    confirmed
  }
}
`;

describe("Register", () => {
  it("Create a user", async () => {
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const call = await gqlCall({
      source: registerMutation,
      variableValues: {
        data,
      },
    });

    expect(call.data).toMatchObject({
      register: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });
    const user = await User.findOne({ email: data.email });
    expect(user).toBeDefined();
    expect(user?.confirmed).toBeFalsy();
    expect(user?.firstName).toBe(data.firstName);
    expect(user?.lastName).toBe(data.lastName);
    let isPasswordMatching: boolean = false;
    if (user?.password) {
      isPasswordMatching = await argon2.verify(user.password, data.password);
    }
    expect(isPasswordMatching).toBeTruthy();
  }, 30000);
});
