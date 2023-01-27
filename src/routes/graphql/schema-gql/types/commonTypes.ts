import { FastifyInstance } from 'fastify';
import { GraphQLError } from 'graphql';

export interface ResolverContext {
  fastify: FastifyInstance;
  validationDepth: ReadonlyArray<GraphQLError>;
  dataLoader: {
    users: {};
  };
}
