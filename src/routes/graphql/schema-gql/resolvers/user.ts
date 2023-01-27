import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { ResolverContext } from '../types/commonTypes';

export const getUserPosts = async (parent: UserEntity, args: unknown, { fastify }: ResolverContext) => {
  const postsReq = await fastify.inject({
    method: 'GET',
    url: '/posts',
  });
  const posts = postsReq.json<PostEntity[]>();
  return posts.filter((post) => post.userId === parent.id);
};

export const getUserProfiles = async (parent: UserEntity, args: unknown, { fastify }: ResolverContext) => {
  const profilesReq = await fastify.inject({
    method: 'GET',
    url: `/profiles`,
  });
  const profiles = profilesReq.json<ProfileEntity[]>();
  return profiles.filter((profile) => profile.userId === parent.id);
};

export const getUserProfile = async (parent: UserEntity, args: unknown, { fastify }: ResolverContext) => {
  const profilesReq = await fastify.inject({
    method: 'GET',
    url: `/profiles`,
  });
  const profiles = profilesReq.json<ProfileEntity[]>();
  return profiles.find((profile) => profile.userId === parent.id) || null;
};

export const getUserMemberTypes = async (parent: UserEntity, args: unknown, { fastify }: ResolverContext) => {
  const memberTypesReq = await fastify.inject({
    method: 'GET',
    url: `/member-types`,
  });
  const memberTypes = memberTypesReq.json<MemberTypeEntity[]>();

  const profilesReq = await fastify.inject({
    method: 'GET',
    url: `/profiles`,
  });
  const profiles = profilesReq.json<ProfileEntity[]>();
  const userProfile = profiles.find((profile) => profile.userId === parent.id);

  return memberTypes.filter((memberType) => memberType.id === (userProfile ? userProfile.memberTypeId : null));
};

export const getUserMemberType = async (parent: UserEntity, args: unknown, { fastify }: ResolverContext) => {
  const memberTypesReq = await fastify.inject({
    method: 'GET',
    url: `/member-types`,
  });
  const memberTypes = memberTypesReq.json<MemberTypeEntity[]>();

  const profilesReq = await fastify.inject({
    method: 'GET',
    url: `/profiles`,
  });
  const profiles = profilesReq.json<ProfileEntity[]>();
  const userProfile = profiles.find((profile) => profile.userId === parent.id);

  return memberTypes.find((memberType) => memberType.id === (userProfile ? userProfile.memberTypeId : null)) || null;
};

export const getUserSubscribedTo = async (parent: UserEntity, args: unknown, { fastify }: ResolverContext) => {
  const usersReq = await fastify.inject({
    method: 'GET',
    url: '/users',
  });
  const users = usersReq.json<UserEntity[]>();

  return users.filter((someUser) => someUser.subscribedToUserIds.includes(parent.id));
};

export const getSubscribedToUser = async (parent: UserEntity, args: unknown, { fastify }: ResolverContext) => {
  const usersReq = await fastify.inject({
    method: 'GET',
    url: '/users',
  });
  const users = usersReq.json<UserEntity[]>();

  return users.filter((someUser) => parent.subscribedToUserIds.includes(someUser.id));
};
