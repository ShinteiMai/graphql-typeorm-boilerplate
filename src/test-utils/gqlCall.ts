import { graphql, GraphQLSchema } from "graphql";

import { createSchema } from "../utils/createSchema";
import { Maybe } from "graphql/jsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export const gqlCall = async ({ source, variableValues }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
  });
};
