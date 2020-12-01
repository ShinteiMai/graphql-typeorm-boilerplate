import { testConnection } from "../../../test-utils/testConnection";
import { Connection } from "typeorm";
import { gqlCall } from "../../../test-utils/gqlCall";

let conn: Connection;

beforeAll(async () => {
  conn = await testConnection();
});

afterAll(async () => {
  await conn.close();
});

// const registerMutation = `
//   mutation Register($data: RegisterInput!) {
//     register(
//       data: $data
//     ) {
//       id
//       firstName
//       lastName
//       email
//       name
//     }
//   }
// `;

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
    console.log(
      await gqlCall({
        source: registerMutation,
        variableValues: {
          data: {
            firstName: "bobsasdaa",
            lastName: "bobasaad",
            email: "bob123@bob.aacom",
            password: "asdasdasdsaadasd",
          },
        },
      })
    );
  }, 30000);
});
