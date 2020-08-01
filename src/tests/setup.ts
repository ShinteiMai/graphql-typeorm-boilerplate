import { server } from "../initializeServer";
import { AddressInfo } from "net";

export const setup = async (): Promise<void> => {
  const app = await server();
  const { port } = app.address() as AddressInfo;
  process.env.TEST_HOST = `http://127.0.0.1:${port}`;
};
