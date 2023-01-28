import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, parse } from 'graphql';
import * as DataLoader from 'dataloader';
import { validate } from 'graphql/validation';
import * as depthLimit from 'graphql-depth-limit';
import { gqlSchema } from './schema-gql/index';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { UserEntity } from '../../utils/DB/entities/DBUsers';

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
      // const isValid = validate(schema, parse(gqlRequest.query!), [depthLimit(10)]);
      // console.dir('validation');
      // console.dir(isValid);
      // if (isValid.length > 0) {
      //   const [error] = isValid;
      //   throw error;
      // }
      if (gqlRequest.query) {
        return graphql({
          schema: gqlSchema,
          source: gqlRequest.query,
          contextValue: {
            fastify,
            validationDepth: validate(gqlSchema, parse(gqlRequest.query), [depthLimit(1)]),
            dataLoader: {
              postsLoader: new DataLoader(async (ids: readonly string[]) => {
                const postsReq = await fastify.inject({
                  method: 'GET',
                  url: '/posts',
                });
                const posts = postsReq.json<PostEntity[]>();

                return ids.map((id) => posts.filter((post) => post.userId === id));
              }),

              profilesLoader: new DataLoader(async (ids: readonly string[]) => {
                const profilesReq = await fastify.inject({
                  method: 'GET',
                  url: `/profiles`,
                });
                const profiles = profilesReq.json<ProfileEntity[]>();

                return ids.map((id) => profiles.filter((profile) => profile.userId === id));
              }),

              memberTypesLoader: new DataLoader(async (ids: readonly string[]) => {
                const memberTypesReq = await fastify.inject({
                  method: 'GET',
                  url: `/member-types`,
                });
                const memberTypes = memberTypesReq.json<MemberTypeEntity[]>();

                return ids.map((id) => memberTypes.filter((memberType) => memberType.id === id));
              }),

              usersLoader: new DataLoader(async (calls: readonly string[]) => {
                const usersReq = await fastify.inject({
                  method: 'GET',
                  url: '/users',
                });
                const users = usersReq.json<UserEntity[]>();

                return calls.map(() => users);
              }),
            },
          },
          variableValues: gqlRequest.variables,
        });
      }
      // { query: 'mutation {\r\n    setMessage(message: "some msg")\r\n}' }
      // if (gqlRequest.mutation) {
      //   return graphql({
      //     schema,
      //     source: gqlRequest.mutation,
      //     contextValue: fastify,
      //   });
      // }
    }
  );
};

export default plugin;
