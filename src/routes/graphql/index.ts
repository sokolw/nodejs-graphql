import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  graphql,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';
import { UserEntity } from '../../utils/DB/entities/DBUsers';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { FastifyInstance } from 'fastify';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

// const gqlSchema = buildSchema(sdlSchema);

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const memberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const userType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (parent: UserEntity, _, contextValue: FastifyInstance) => {
        const postsReq = await contextValue.inject({
          method: 'GET',
          url: '/posts',
        });
        const posts = postsReq.json<PostEntity[]>();
        return posts.filter((post) => post.userId === parent.id);
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve: async (parent: UserEntity, _, contextValue: FastifyInstance) => {
        const profilesReq = await contextValue.inject({
          method: 'GET',
          url: `/profiles`,
        });
        const profiles = profilesReq.json<ProfileEntity[]>();
        return profiles.filter((profile) => profile.userId === parent.id);
      },
    },
    profile: {
      type: profileType,
      resolve: async (parent: UserEntity, _, contextValue: FastifyInstance) => {
        const profilesReq = await contextValue.inject({
          method: 'GET',
          url: `/profiles`,
        });
        const profiles = profilesReq.json<ProfileEntity[]>();
        return profiles.find((profile) => profile.userId === parent.id) || null;
      },
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberTypeType))),
      resolve: async (parent: UserEntity, _, contextValue: FastifyInstance) => {
        const memberTypesReq = await contextValue.inject({
          method: 'GET',
          url: `/member-types`,
        });
        const memberTypes = memberTypesReq.json<MemberTypeEntity[]>();

        const profilesReq = await contextValue.inject({
          method: 'GET',
          url: `/profiles`,
        });
        const profiles = profilesReq.json<ProfileEntity[]>();
        const userProfile = profiles.find((profile) => profile.userId === parent.id);

        return memberTypes.filter((memberType) => memberType.id === (userProfile ? userProfile.memberTypeId : null));
      },
    },
    memberType: {
      type: memberTypeType,
      resolve: async (parent: UserEntity, _, contextValue: FastifyInstance) => {
        const memberTypesReq = await contextValue.inject({
          method: 'GET',
          url: `/member-types`,
        });
        const memberTypes = memberTypesReq.json<MemberTypeEntity[]>();

        const profilesReq = await contextValue.inject({
          method: 'GET',
          url: `/profiles`,
        });
        const profiles = profilesReq.json<ProfileEntity[]>();
        const userProfile = profiles.find((profile) => profile.userId === parent.id);

        return (
          memberTypes.find((memberType) => memberType.id === (userProfile ? userProfile.memberTypeId : null)) || null
        );
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (parent: UserEntity, _, contextValue: FastifyInstance) => {
        const usersReq = await contextValue.inject({
          method: 'GET',
          url: '/users',
        });
        const users = usersReq.json<UserEntity[]>();

        return users.filter((someUser) => someUser.subscribedToUserIds.includes(parent.id));
      },
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (parent: UserEntity, _, contextValue: FastifyInstance) => {
        const usersReq = await contextValue.inject({
          method: 'GET',
          url: '/users',
        });
        const users = usersReq.json<UserEntity[]>();

        return users.filter((someUser) => parent.subscribedToUserIds.includes(someUser.id));
      },
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (_, __, contextValue: FastifyInstance) => {
        const usersReq = await contextValue.inject({
          method: 'GET',
          url: '/users',
        });
        const users = usersReq.json<UserEntity[]>();
        return users;
      },
    },
    user: {
      type: new GraphQLNonNull(userType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, args: { id: string }, contextValue: FastifyInstance) => {
        const { id } = args;
        const userReq = await contextValue.inject({
          method: 'GET',
          url: `/users/${id}`,
        });
        if (userReq.statusCode !== 404) {
          return userReq.json<UserEntity[]>();
        }

        return null;
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (_, __, contextValue: FastifyInstance) => {
        const postsReq = await contextValue.inject({
          method: 'GET',
          url: '/posts',
        });
        return postsReq.json<PostEntity[]>();
      },
    },

    post: {
      type: new GraphQLNonNull(postType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, args: { id: string }, contextValue: FastifyInstance) => {
        const { id } = args;
        const postsReq = await contextValue.inject({
          method: 'GET',
          url: `/posts/${id}`,
        });

        if (postsReq.statusCode !== 404) {
          return postsReq.json<UserEntity>();
        }

        return null;
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve: async (_, __, contextValue: FastifyInstance) => {
        const profilesReq = await contextValue.inject({
          method: 'GET',
          url: `/profiles`,
        });

        return profilesReq.json<ProfileEntity[]>();
      },
    },

    profile: {
      type: new GraphQLNonNull(profileType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, args: { id: string }, contextValue: FastifyInstance) => {
        const { id } = args;
        const profileReq = await contextValue.inject({
          method: 'GET',
          url: `/profiles/${id}`,
        });

        if (profileReq.statusCode !== 404) {
          return profileReq.json<ProfileEntity>();
        }

        return null;
      },
    },

    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberTypeType))),
      resolve: async (_, __, contextValue: FastifyInstance) => {
        const memberTypesReq = await contextValue.inject({
          method: 'GET',
          url: `/member-types`,
        });

        return memberTypesReq.json<MemberTypeEntity[]>();
      },
    },

    memberType: {
      type: new GraphQLNonNull(memberTypeType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, args: { id: string }, contextValue: FastifyInstance) => {
        const { id } = args;
        const memberTypeReq = await contextValue.inject({
          method: 'GET',
          url: `/member-types/${id}`,
        });

        if (memberTypeReq.statusCode !== 404) {
          return memberTypeReq.json<MemberTypeEntity>();
        }

        return null;
      },
    },
  },
});

const addUserInputType = new GraphQLInputObjectType({
  name: 'AddUserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const addProfileInputType = new GraphQLInputObjectType({
  name: 'AddProfileInput',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const addPostInputType = new GraphQLInputObjectType({
  name: 'AddPostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const updateUserInputType = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const updateProfileInputType = new GraphQLInputObjectType({
  name: 'UpdateProfileInput',
  fields: {
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  },
});

const updatePostInputType = new GraphQLInputObjectType({
  name: 'UpdatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const updateMemberTypeInputType = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeInput',
  fields: {
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: new GraphQLNonNull(userType),
      args: { input: { type: new GraphQLNonNull(addUserInputType) } },
      resolve: async (
        _,
        args: { input: Omit<UserEntity, 'id' | 'subscribedToUserIds'> },
        contextValue: FastifyInstance
      ) => {
        const userReq = await contextValue.inject({
          method: 'POST',
          url: `/users`,
          payload: args.input,
        });

        if (userReq.statusCode !== 404 && userReq.statusCode !== 400) {
          return userReq.json<UserEntity>();
        }

        return null;
      },
    },

    createProfile: {
      type: new GraphQLNonNull(profileType),
      args: { input: { type: new GraphQLNonNull(addProfileInputType) } },
      resolve: async (_, args: { input: Omit<ProfileEntity, 'id'> }, contextValue: FastifyInstance) => {
        const profileReq = await contextValue.inject({
          method: 'POST',
          url: `/profiles`,
          payload: args.input,
        });

        if (profileReq.statusCode !== 404 && profileReq.statusCode !== 400) {
          return profileReq.json<ProfileEntity>();
        }

        return null;
      },
    },

    createPost: {
      type: new GraphQLNonNull(postType),
      args: { input: { type: new GraphQLNonNull(addPostInputType) } },
      resolve: async (_, args: { input: Omit<PostEntity, 'id'> }, contextValue: FastifyInstance) => {
        const postReq = await contextValue.inject({
          method: 'POST',
          url: `/posts`,
          payload: args.input,
        });

        if (postReq.statusCode !== 404 && postReq.statusCode !== 400) {
          return postReq.json<PostEntity>();
        }

        return null;
      },
    },

    updateUser: {
      type: new GraphQLNonNull(userType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(updateUserInputType) },
      },
      resolve: async (
        _,
        args: { id: string; input: Partial<Omit<UserEntity, 'id' | 'subscribedToUserIds'>> },
        contextValue: FastifyInstance
      ) => {
        const { id } = args;
        const userReq = await contextValue.inject({
          method: 'PATCH',
          url: `/users/${id}`,
          payload: args.input,
        });
        if (userReq.statusCode !== 404 && userReq.statusCode !== 400) {
          return userReq.json<UserEntity>();
        }

        return null;
      },
    },

    updateProfile: {
      type: new GraphQLNonNull(profileType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(updateProfileInputType) },
      },
      resolve: async (
        _,
        args: { id: string; input: Partial<Omit<ProfileEntity, 'id' | 'userId'>> },
        contextValue: FastifyInstance
      ) => {
        const { id } = args;
        const profileReq = await contextValue.inject({
          method: 'PATCH',
          url: `/profiles/${id}`,
          payload: args.input,
        });
        if (profileReq.statusCode !== 404 && profileReq.statusCode !== 400) {
          return profileReq.json<ProfileEntity>();
        }

        return null;
      },
    },

    updatePost: {
      type: new GraphQLNonNull(postType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(updatePostInputType) },
      },
      resolve: async (
        _,
        args: { id: string; input: Partial<Omit<PostEntity, 'id' | 'userId'>> },
        contextValue: FastifyInstance
      ) => {
        const { id } = args;
        const postReq = await contextValue.inject({
          method: 'PATCH',
          url: `/posts/${id}`,
          payload: args.input,
        });
        if (postReq.statusCode !== 404 && postReq.statusCode !== 400) {
          return postReq.json<PostEntity>();
        }

        return null;
      },
    },

    updateMemberType: {
      type: new GraphQLNonNull(memberTypeType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(updateMemberTypeInputType) },
      },
      resolve: async (
        _,
        args: { id: string; input: Partial<Omit<MemberTypeEntity, 'id'>> },
        contextValue: FastifyInstance
      ) => {
        const { id } = args;
        const postReq = await contextValue.inject({
          method: 'PATCH',
          url: `/member-types/${id}`,
          payload: args.input,
        });
        if (postReq.statusCode !== 404 && postReq.statusCode !== 400) {
          return postReq.json<MemberTypeEntity>();
        }

        return null;
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(userType),
      args: {
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
        followId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, args: { subscriberId: string; followId: string }, contextValue: FastifyInstance) => {
        const { subscriberId, followId } = args;
        const subscribeReq = await contextValue.inject({
          method: 'POST',
          url: `/users/${subscriberId}/subscribeTo`,
          payload: { userId: followId },
        });
        if (subscribeReq.statusCode !== 404 && subscribeReq.statusCode !== 400) {
          return subscribeReq.json<UserEntity>();
        }

        return null;
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(userType),
      args: {
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
        followId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, args: { subscriberId: string; followId: string }, contextValue: FastifyInstance) => {
        const { subscriberId, followId } = args;
        const subscribeReq = await contextValue.inject({
          method: 'POST',
          url: `/users/${subscriberId}/unsubscribeFrom`,
          payload: { userId: followId },
        });
        if (subscribeReq.statusCode !== 404 && subscribeReq.statusCode !== 400) {
          return subscribeReq.json<UserEntity>();
        }

        return null;
      },
    },
  },
});

const gqlCodeSchema = new GraphQLSchema({ query: queryType, mutation: mutationType });

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

      if (gqlRequest.query) {
        return graphql({
          schema: gqlCodeSchema,
          source: gqlRequest.query,
          contextValue: fastify,
          variableValues: gqlRequest.variables,
        });
      }
      // { query: 'mutation {\r\n    setMessage(message: "some msg")\r\n}' }
      if (gqlRequest.mutation) {
        return graphql({
          schema: gqlCodeSchema,
          source: gqlRequest.mutation,
          contextValue: fastify,
        });
      }
    }
  );
};

export default plugin;
