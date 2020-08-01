import { getConnectionOptions, createConnection } from "typeorm";

export const initializeTypeorm = async () => {
  const options = await getConnectionOptions(process.env.NODE_ENV);
  await createConnection({ ...options, name: "default" });
};
