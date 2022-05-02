import {
  addMockFunctionsToSchema,
  makeExecutableSchema,
  mergeSchemas,
} from 'graphql-tools';
import * as ctp from './ctp';
import * as pimIndexer from './pim-indexer';
import * as mc from './mc';
import * as settings from './settings';

export const createRosie = () => ({
  ctp: ctp.createRosie(),
});

const setupMocks = (schema, resolvers) =>
  addMockFunctionsToSchema({
    schema,
    mocks: resolvers,
    preserveResolvers: true,
  });

export const createGraphqlTargets = (fixtures = {}, resolvers = {}) =>
  [
    ['mc', mc, fixtures.mc, resolvers.mc],
    ['pim-indexer', pimIndexer, fixtures.pimIndexer, resolvers.pimIndexer],
    ['ctp', ctp, fixtures.ctp, resolvers.ctp],
    ['settings', settings, fixtures.settings, resolvers.settings],
  ].reduce(
    (
      result,
      [
        targetName,
        { createResolvers, schema, customSchema },
        fixture,
        customResolvers,
      ]
    ) => {
      const executableSchema = makeExecutableSchema({
        typeDefs: schema,
        resolverValidationOptions: {
          requireResolversForResolveType: false,
        },
      });

      setupMocks(executableSchema, createResolvers(fixture, customResolvers));

      if (customSchema) {
        const executableCustomSchema = makeExecutableSchema({
          typeDefs: customSchema,
          resolverValidationOptions: {
            requireResolversForResolveType: false,
          },
        });
        setupMocks(
          executableCustomSchema,
          createResolvers(fixture, customResolvers)
        );
        return {
          ...result,
          [targetName]: mergeSchemas({
            schemas: [executableSchema, executableCustomSchema],
          }),
        };
      }

      return { ...result, [targetName]: executableSchema };
    },
    {}
  );
