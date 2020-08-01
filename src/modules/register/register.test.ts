import { request } from "graphql-request";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  minEmailLength,
  invalidEmail,
  minPasswordLength,
} from "./errorMessages";
import { initializeTypeorm } from "../../utils/initializeTypeorm";

const user = {
  email: "dam@damn.com",
  password: "asasdasd",
};

const mutation = (e: string, p: string) => `
    mutation {
        register(email: "${e}", password: "${p}") {
            path
            message
        }
    }
`;

beforeAll(async () => {
  await initializeTypeorm();
});

describe("Register a user", () => {
  it("capables of registering a user", async () => {
    const response = await request(
      process.env.TEST_HOST as string,
      mutation(user.email, user.password)
    );
    expect(response).toEqual({ register: null });

    const users = await User.find({ where: { email: user.email } });
    expect(users).toHaveLength(1);

    const registeredUser = users[0];
    expect(registeredUser.email).toEqual(user.email);
    expect(registeredUser.password).not.toEqual(user.password);
  });
  it("capables for checking duplicate emails", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      mutation(user.email, user.password)
    );
    expect(response.register).toHaveLength(1);
    expect(response.register[0]).toEqual({
      path: "email",
      message: duplicateEmail,
    });
  });

  it("capables of checking invalid emails", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      mutation("b", user.password)
    );
    expect(response.register).toHaveLength(2);
    expect(response).toEqual({
      register: [
        {
          path: "email",
          message: minEmailLength,
        },
        {
          path: "email",
          message: invalidEmail,
        },
      ],
    });
  });

  it("capables of checking invalid passwords", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      mutation(user.email, "as")
    );
    expect(response.register).toHaveLength(1);
    expect(response).toEqual({
      register: [
        {
          path: "password",
          message: minPasswordLength,
        },
      ],
    });
  });

  it("capables of checking both invalid emails and passwords", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      mutation("as", "as")
    );
    expect(response.register).toHaveLength(3);
    expect(response).toEqual({
      register: [
        {
          path: "email",
          message: minEmailLength,
        },
        {
          path: "email",
          message: invalidEmail,
        },
        {
          path: "password",
          message: minPasswordLength,
        },
      ],
    });
  });
});
