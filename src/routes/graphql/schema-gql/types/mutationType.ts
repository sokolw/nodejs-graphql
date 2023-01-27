import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import {
  createPost,
  createProfile,
  createUser,
  subscribeTo,
  unsubscribeFrom,
  updateMemberType,
  updatePost,
  updateProfile,
  updateUser,
} from '../resolvers/mutation';
import { memberTypeType, postType, profileType, userType } from './dataTypes';
import {
  addPostInputType,
  addProfileInputType,
  addUserInputType,
  updateMemberTypeInputType,
  updatePostInputType,
  updateProfileInputType,
  updateUserInputType,
} from './inputTypes';

export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: new GraphQLNonNull(userType),
      args: { input: { type: new GraphQLNonNull(addUserInputType) } },
      resolve: createUser,
    },

    createProfile: {
      type: new GraphQLNonNull(profileType),
      args: { input: { type: new GraphQLNonNull(addProfileInputType) } },
      resolve: createProfile,
    },

    createPost: {
      type: new GraphQLNonNull(postType),
      args: { input: { type: new GraphQLNonNull(addPostInputType) } },
      resolve: createPost,
    },

    updateUser: {
      type: new GraphQLNonNull(userType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(updateUserInputType) },
      },
      resolve: updateUser,
    },

    updateProfile: {
      type: new GraphQLNonNull(profileType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(updateProfileInputType) },
      },
      resolve: updateProfile,
    },

    updatePost: {
      type: new GraphQLNonNull(postType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(updatePostInputType) },
      },
      resolve: updatePost,
    },

    updateMemberType: {
      type: new GraphQLNonNull(memberTypeType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(updateMemberTypeInputType) },
      },
      resolve: updateMemberType,
    },

    subscribeTo: {
      type: new GraphQLNonNull(userType),
      args: {
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
        followId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: subscribeTo,
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(userType),
      args: {
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
        followId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: unsubscribeFrom,
    },
  },
});
