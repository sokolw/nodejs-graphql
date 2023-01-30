import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, parse } from 'graphql';
import { validate } from 'graphql/validation';
import * as depthLimit from 'graphql-depth-limit';
import { gqlSchema } from './schema-gql/index';
import { connectDataLoaders } from './data-loaders';

const DEFAULT_DEPTH_LIMIT = 6;

type gqlRequestType = {
  body: {
    query?: string;
    mutation?: string;
    variables?: { [variable: string]: unknown };
  };
};

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { body: gqlRequest }  = request as gqlRequestType;
      if (gqlRequest.query || gqlRequest.mutation) {
        return graphql({
          schema: gqlSchema,
          source: (gqlRequest.query || gqlRequest.mutation)!,
          contextValue: {
            fastify,
            validationDepth: validate(gqlSchema, parse((gqlRequest.query || gqlRequest.mutation)!), [
              depthLimit(DEFAULT_DEPTH_LIMIT),
            ]),
            dataLoader: connectDataLoaders(fastify),
          },
          variableValues: gqlRequest.variables,
        });
      }
    }
  );
};

export default plugin;
