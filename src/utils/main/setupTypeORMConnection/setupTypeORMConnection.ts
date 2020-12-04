import { BaseEntity, createConnection, getConnectionOptions } from "typeorm";

export const setupTypeORMConnection = async (name?: string) => {
  const options = await getConnectionOptions(
    process.env.NODE_ENV || name || "test"
  );
  const connection = await createConnection(options);
  BaseEntity.useConnection(connection);
  return connection;
};
