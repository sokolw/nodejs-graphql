import { GraphQLSchema } from 'graphql';
import { mutationType } from './types/mutationType';
import { queryType } from './types/queryType';

export const gqlSchema = new GraphQLSchema({ query: queryType, mutation: mutationType });
