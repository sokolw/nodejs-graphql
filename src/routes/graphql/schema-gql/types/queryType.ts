import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID, GraphQLString } from 'graphql';
import {
  getMemberType,
  getMemberTypes,
  getPost,
  getPosts,
  getProfile,
  getProfiles,
  getUser,
  getUsers,
} from '../resolvers/query';
import { memberTypeType, postType, profileType, userType } from './dataTypes';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: getUsers,
    },

    user: {
      type: new GraphQLNonNull(userType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: getUser,
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: getPosts,
    },

    post: {
      type: new GraphQLNonNull(postType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: getPost,
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve: getProfiles,
    },

    profile: {
      type: new GraphQLNonNull(profileType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: getProfile,
    },

    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberTypeType))),
      resolve: getMemberTypes,
    },

    memberType: {
      type: new GraphQLNonNull(memberTypeType),
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: getMemberType,
    },
  },
});
