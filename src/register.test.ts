import { request } from "graphql-request";
import { User } from "./entity/User";
import { initializeTypeorm } from "./utils/initializeTypeorm";

beforeAll(async () => {
  await initializeTypeorm();
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
  const response = await request("http://localhost:4000", mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email: user.email } });
  expect(users).toHaveLength(1);

  const registeredUser = users[0];
  expect(registeredUser.email).toEqual(user.email);
  expect(registeredUser.password).not.toEqual(user.password);
});
