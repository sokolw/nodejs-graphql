import { FastifyInstance } from 'fastify';
import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';

export const getUsers = async (parent: unknown, args: unknown, contextValue: FastifyInstance) => {
  const usersReq = await contextValue.inject({
    method: 'GET',
    url: '/users',
  });
  const users = usersReq.json<UserEntity[]>();
  return users;
};

export const getUser = async (parent: unknown, args: { id: string }, contextValue: FastifyInstance) => {
  const { id } = args;
  const userReq = await contextValue.inject({
    method: 'GET',
    url: `/users/${id}`,
  });
  if (userReq.statusCode !== 404) {
    return userReq.json<UserEntity[]>();
  }

  return null;
};

export const getPosts = async (parent: unknown, args: unknown, contextValue: FastifyInstance) => {
  const postsReq = await contextValue.inject({
    method: 'GET',
    url: '/posts',
  });
  return postsReq.json<PostEntity[]>();
};

export const getPost = async (parent: unknown, args: { id: string }, contextValue: FastifyInstance) => {
  const { id } = args;
  const postsReq = await contextValue.inject({
    method: 'GET',
    url: `/posts/${id}`,
  });

  if (postsReq.statusCode !== 404) {
    return postsReq.json<UserEntity>();
  }

  return null;
};

export const getProfiles = async (parent: unknown, args: unknown, contextValue: FastifyInstance) => {
  const profilesReq = await contextValue.inject({
    method: 'GET',
    url: `/profiles`,
  });

  return profilesReq.json<ProfileEntity[]>();
};

export const getProfile = async (parent: unknown, args: { id: string }, contextValue: FastifyInstance) => {
  const { id } = args;
  const profileReq = await contextValue.inject({
    method: 'GET',
    url: `/profiles/${id}`,
  });

  if (profileReq.statusCode !== 404) {
    return profileReq.json<ProfileEntity>();
  }

  return null;
};

export const getMemberTypes = async (parent: unknown, args: unknown, contextValue: FastifyInstance) => {
  const memberTypesReq = await contextValue.inject({
    method: 'GET',
    url: `/member-types`,
  });

  return memberTypesReq.json<MemberTypeEntity[]>();
};

export const getMemberType = async (parent: unknown, args: { id: string }, contextValue: FastifyInstance) => {
  const { id } = args;
  const memberTypeReq = await contextValue.inject({
    method: 'GET',
    url: `/member-types/${id}`,
  });

  if (memberTypeReq.statusCode !== 404) {
    return memberTypeReq.json<MemberTypeEntity>();
  }

  return null;
};
