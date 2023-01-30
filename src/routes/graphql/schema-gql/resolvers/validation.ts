import { GraphQLError } from 'graphql';

export const resolveValidationDepth = (errors: ReadonlyArray<GraphQLError>) => {
  if (errors.length > 0) {
    const [error] = errors;
    console.log(error);
    throw error;
  }
};
