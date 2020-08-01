import { request } from "graphql-request";
import { AddressInfo } from "net";
import { server } from "../../initializeServer";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  minEmailLength,
  invalidEmail,
  minPasswordLength,
} from "./errorMessages";

let getHost = () => ``;

beforeAll(async () => {
  const app = await server();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}`;
});

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

test("register a user", async () => {
  // * Make sure that we can register a user
  const response = await request(
    getHost(),
    mutation(user.email, user.password)
  );
  expect(response).toEqual({ register: null });

  const users = await User.find({ where: { email: user.email } });
  expect(users).toHaveLength(1);

  const registeredUser = users[0];
  expect(registeredUser.email).toEqual(user.email);
  expect(registeredUser.password).not.toEqual(user.password);

  // * Test for duplicate emails
  const response2: any = await request(
    getHost(),
    mutation(user.email, user.password)
  );
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0]).toEqual({
    path: "email",
    message: duplicateEmail,
  });

  // * Catch bad emails
  const response3: any = await request(getHost(), mutation("b", user.password));
  expect(response3.register).toHaveLength(2);
  expect(response3).toEqual({
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

  // * Catch bad password
  const response4: any = await request(getHost(), mutation(user.email, "as"));
  expect(response4.register).toHaveLength(1);
  expect(response4).toEqual({
    register: [
      {
        path: "password",
        message: minPasswordLength,
      },
    ],
  });

  const response5: any = await request(getHost(), mutation("as", "as"));
  expect(response5.register).toHaveLength(3);
  expect(response5).toEqual({
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
