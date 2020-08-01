import { request } from "graphql-request";
import { AddressInfo } from "net";

import { User } from "./entity/User";
import { server } from "./initializeServer";

let getHost = () => ``;

beforeAll(async () => {
  const app = await server();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}`;
});

const user = {
  email: "danke@danke.com",
  password: "asdasdads",
};

const mutation = `
    mutation {
        register(email: "${user.email}", password: "${user.password}")
    }
`;

test("register a user", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email: user.email } });
  expect(users).toHaveLength(1);

  const registeredUser = users[0];
  expect(registeredUser.email).toEqual(user.email);
  expect(registeredUser.password).not.toEqual(user.password);
});
