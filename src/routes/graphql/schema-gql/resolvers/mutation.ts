import { FastifyInstance } from 'fastify';
import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';

export const createUser = async (
  parent: unknown,
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
};

export const createProfile = async (
  parent: unknown,
  args: { input: Omit<ProfileEntity, 'id'> },
  contextValue: FastifyInstance
) => {
  const profileReq = await contextValue.inject({
    method: 'POST',
    url: `/profiles`,
    payload: args.input,
  });

  if (profileReq.statusCode !== 404 && profileReq.statusCode !== 400) {
    return profileReq.json<ProfileEntity>();
  }

  return null;
};

export const createPost = async (
  parent: unknown,
  args: { input: Omit<PostEntity, 'id'> },
  contextValue: FastifyInstance
) => {
  const postReq = await contextValue.inject({
    method: 'POST',
    url: `/posts`,
    payload: args.input,
  });

  if (postReq.statusCode !== 404 && postReq.statusCode !== 400) {
    return postReq.json<PostEntity>();
  }

  return null;
};

export const updateUser = async (
  parent: unknown,
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
};

export const updateProfile = async (
  parent: unknown,
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
};

export const updatePost = async (
  parent: unknown,
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
};

export const updateMemberType = async (
  parent: unknown,
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
};

export const subscribeTo = async (
  parent: unknown,
  args: { subscriberId: string; followId: string },
  contextValue: FastifyInstance
) => {
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
};

export const unsubscribeFrom = async (
  parent: unknown,
  args: { subscriberId: string; followId: string },
  contextValue: FastifyInstance
) => {
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
};
