import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  //require: ['ts-node/register'],
  generates: {
    "src/generated/graphql.ts": {
      config: {
        useIndexSignature: true,
        // Providing our context's interface ensures our
        // context's type is set for all of our resolvers.

        // Note, this file path starts from the location of the
        // file where you generate types.
        // (i.e., `/src/__generated__/resolvers-types.ts` above)
        contextType: "../index#MyContext",

        // map GraphQL types to your custom model types
        mappers: {
          Person: "../models/person#IPerson",
          User: "../models/user#IUser",
        },
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
