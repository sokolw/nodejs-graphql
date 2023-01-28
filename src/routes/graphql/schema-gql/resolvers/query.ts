import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { ResolverContext } from '../types/commonTypes';
import { resolveValidationDepth } from './validation';
import { GraphQLError } from 'graphql';

export const getUsers = async (parent: unknown, args: unknown, { dataLoader, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  return dataLoader.usersLoader.load('call');
};

export const getUser = async (parent: unknown, args: { id: string }, { fastify, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const { id } = args;
  const userReq = await fastify.inject({
    method: 'GET',
    url: `/users/${id}`,
  });
  if (userReq.statusCode !== 404) {
    return userReq.json<UserEntity[]>();
  }

  return new GraphQLError('User is not exist.');
};

export const getPosts = async (parent: unknown, args: unknown, { fastify, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const postsReq = await fastify.inject({
    method: 'GET',
    url: '/posts',
  });
  return postsReq.json<PostEntity[]>();
};

export const getPost = async (parent: unknown, args: { id: string }, { fastify, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const { id } = args;
  const postsReq = await fastify.inject({
    method: 'GET',
    url: `/posts/${id}`,
  });

  if (postsReq.statusCode !== 404) {
    return postsReq.json<UserEntity>();
  }

  return new GraphQLError('Post is not exist.');
};

export const getProfiles = async (parent: unknown, args: unknown, { fastify, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const profilesReq = await fastify.inject({
    method: 'GET',
    url: `/profiles`,
  });

  return profilesReq.json<ProfileEntity[]>();
};

export const getProfile = async (parent: unknown, args: { id: string }, { fastify, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const { id } = args;
  const profileReq = await fastify.inject({
    method: 'GET',
    url: `/profiles/${id}`,
  });

  if (profileReq.statusCode !== 404) {
    return profileReq.json<ProfileEntity>();
  }

  return new GraphQLError('Profile is not exist.');
};

export const getMemberTypes = async (parent: unknown, args: unknown, { fastify, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const memberTypesReq = await fastify.inject({
    method: 'GET',
    url: `/member-types`,
  });

  return memberTypesReq.json<MemberTypeEntity[]>();
};

export const getMemberType = async (parent: unknown, args: { id: string }, { fastify, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const { id } = args;
  const memberTypeReq = await fastify.inject({
    method: 'GET',
    url: `/member-types/${id}`,
  });

  if (memberTypeReq.statusCode !== 404) {
    return memberTypeReq.json<MemberTypeEntity>();
  }

  return new GraphQLError(`MemberType ${id} is not exist.`);
};
