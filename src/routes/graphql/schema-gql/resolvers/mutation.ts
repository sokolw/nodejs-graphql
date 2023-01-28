import { GraphQLError } from 'graphql';
import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { ResolverContext } from '../types/commonTypes';
import { resolveValidationDepth } from './validation';

export const createUser = async (
  parent: unknown,
  args: { input: Omit<UserEntity, 'id' | 'subscribedToUserIds'> },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const userReq = await fastify.inject({
    method: 'POST',
    url: `/users`,
    payload: args.input,
  });

  if (userReq.statusCode !== 404 && userReq.statusCode !== 400) {
    return userReq.json<UserEntity>();
  }

  return new GraphQLError(userReq.json().message);
};

export const createProfile = async (
  parent: unknown,
  args: { input: Omit<ProfileEntity, 'id'> },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const profileReq = await fastify.inject({
    method: 'POST',
    url: `/profiles`,
    payload: args.input,
  });

  if (profileReq.statusCode !== 404 && profileReq.statusCode !== 400) {
    return profileReq.json<ProfileEntity>();
  }

  return new GraphQLError(profileReq.json().message);
};

export const createPost = async (
  parent: unknown,
  args: { input: Omit<PostEntity, 'id'> },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const postReq = await fastify.inject({
    method: 'POST',
    url: `/posts`,
    payload: args.input,
  });

  if (postReq.statusCode !== 404 && postReq.statusCode !== 400) {
    return postReq.json<PostEntity>();
  }

  return new GraphQLError(postReq.json().message);
};

export const updateUser = async (
  parent: unknown,
  args: { id: string; input: Partial<Omit<UserEntity, 'id' | 'subscribedToUserIds'>> },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const { id } = args;
  const userReq = await fastify.inject({
    method: 'PATCH',
    url: `/users/${id}`,
    payload: args.input,
  });
  if (userReq.statusCode !== 404 && userReq.statusCode !== 400) {
    return userReq.json<UserEntity>();
  }

  return new GraphQLError(userReq.json().message);
};

export const updateProfile = async (
  parent: unknown,
  args: { id: string; input: Partial<Omit<ProfileEntity, 'id' | 'userId'>> },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const { id } = args;
  const profileReq = await fastify.inject({
    method: 'PATCH',
    url: `/profiles/${id}`,
    payload: args.input,
  });
  if (profileReq.statusCode !== 404 && profileReq.statusCode !== 400) {
    return profileReq.json<ProfileEntity>();
  }

  return new GraphQLError(profileReq.json().message);
};

export const updatePost = async (
  parent: unknown,
  args: { id: string; input: Partial<Omit<PostEntity, 'id' | 'userId'>> },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const { id } = args;
  const postReq = await fastify.inject({
    method: 'PATCH',
    url: `/posts/${id}`,
    payload: args.input,
  });
  if (postReq.statusCode !== 404 && postReq.statusCode !== 400) {
    return postReq.json<PostEntity>();
  }

  return new GraphQLError(postReq.json().message);
};

export const updateMemberType = async (
  parent: unknown,
  args: { id: string; input: Partial<Omit<MemberTypeEntity, 'id'>> },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const { id } = args;
  const memberTypeReq = await fastify.inject({
    method: 'PATCH',
    url: `/member-types/${id}`,
    payload: args.input,
  });
  if (memberTypeReq.statusCode !== 404 && memberTypeReq.statusCode !== 400) {
    return memberTypeReq.json<MemberTypeEntity>();
  }

  return new GraphQLError(memberTypeReq.json().message);
};

export const subscribeTo = async (
  parent: unknown,
  args: { subscriberId: string; followId: string },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const { subscriberId, followId } = args;
  const subscribeReq = await fastify.inject({
    method: 'POST',
    url: `/users/${subscriberId}/subscribeTo`,
    payload: { userId: followId },
  });
  if (subscribeReq.statusCode !== 404 && subscribeReq.statusCode !== 400) {
    return subscribeReq.json<UserEntity>();
  }
  
  return new GraphQLError(subscribeReq.json().message);;
};

export const unsubscribeFrom = async (
  parent: unknown,
  args: { subscriberId: string; followId: string },
  { fastify, validationDepth }: ResolverContext
) => {
  resolveValidationDepth(validationDepth);
  const { subscriberId, followId } = args;
  const subscribeReq = await fastify.inject({
    method: 'POST',
    url: `/users/${subscriberId}/unsubscribeFrom`,
    payload: { userId: followId },
  });
  if (subscribeReq.statusCode !== 404 && subscribeReq.statusCode !== 400) {
    return subscribeReq.json<UserEntity>();
  }

  return new GraphQLError(subscribeReq.json().message);
};
