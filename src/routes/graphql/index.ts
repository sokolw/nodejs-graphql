import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, parse } from 'graphql';
import { schema } from './schema-gql';
// import DataLoader from 'dataloader';
import { validate } from 'graphql/validation';
import * as depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const gqlRequest = request.body;

      console.log(gqlRequest);
      const isValid = validate(schema, parse(gqlRequest.query!), [depthLimit(2)]);
      console.dir('validation');
      console.dir(isValid);
      if (isValid.length > 0) {
        const [error] = isValid;
        throw error;
      }

      if (gqlRequest.query) {
        return graphql({
          schema,
          source: gqlRequest.query,
          contextValue: fastify,
          variableValues: gqlRequest.variables,
        });
      }
      // { query: 'mutation {\r\n    setMessage(message: "some msg")\r\n}' }
      if (gqlRequest.mutation) {
        return graphql({
          schema,
          source: gqlRequest.mutation,
          contextValue: fastify,
        });
      }
    }
  );
};

export default plugin;
