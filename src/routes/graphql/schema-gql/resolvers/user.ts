import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { ResolverContext } from '../types/commonTypes';

export const getUserPosts = async (parent: UserEntity, args: unknown, { dataLoader }: ResolverContext) => {
  return dataLoader.postsLoader.load(parent.id);
};

export const getUserProfiles = async (parent: UserEntity, args: unknown, { dataLoader }: ResolverContext) => {
  return dataLoader.profilesLoader.load(parent.id);
};

export const getUserProfile = async (parent: UserEntity, args: unknown, { dataLoader }: ResolverContext) => {
  const [profile] = await dataLoader.profilesLoader.load(parent.id);

  return profile || null;
};

export const getUserMemberTypes = async (parent: UserEntity, args: unknown, { dataLoader }: ResolverContext) => {
  const [profile] = await dataLoader.profilesLoader.load(parent.id);

  return dataLoader.memberTypesLoader.load(profile ? profile.memberTypeId : '');
};

export const getUserMemberType = async (parent: UserEntity, args: unknown, { dataLoader }: ResolverContext) => {
  const [profile] = await dataLoader.profilesLoader.load(parent.id);
  const [memberType] = await dataLoader.memberTypesLoader.load(profile ? profile.memberTypeId : '');

  return memberType || null;
};

export const getUserSubscribedTo = async (parent: UserEntity, args: unknown, { dataLoader }: ResolverContext) => {
  const users = await dataLoader.usersLoader.load('call');

  return users.filter((someUser) => someUser.subscribedToUserIds.includes(parent.id));
};

export const getSubscribedToUser = async (parent: UserEntity, args: unknown, { dataLoader }: ResolverContext) => {
  const users = await dataLoader.usersLoader.load('call');

  return users.filter((someUser) => parent.subscribedToUserIds.includes(someUser.id));
};
