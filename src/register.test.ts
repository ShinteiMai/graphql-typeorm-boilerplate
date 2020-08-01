import { request } from "graphql-request";
import { createConnection } from "typeorm";
import { User } from "./entity/User";

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
  const response = await request("http://localhost:4000", mutation);
  expect(response).toEqual({ register: true });

  await createConnection();
  const users = await User.find({ where: { email: user.email } });
  expect(users).toHaveLength(1);

  const registeredUser = users[0];
  expect(registeredUser.email).toEqual(user.email);
  expect(registeredUser.password).not.toEqual(user.password);
});
