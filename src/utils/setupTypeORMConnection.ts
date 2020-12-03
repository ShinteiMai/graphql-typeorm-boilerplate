import { BaseEntity, createConnection, getConnectionOptions } from "typeorm";

export const setupTypeORMConnection = async () => {
  const options = await getConnectionOptions(process.env.NODE_ENV);
  const connection = await createConnection(options);
  BaseEntity.useConnection(connection);
};
