import { GraphQLError } from 'graphql';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { ResolverContext } from '../types/commonTypes';
import { resolveValidationDepth } from './validation';

export const getUserPosts = async (parent: UserEntity, args: unknown, { dataLoader, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  return dataLoader.postsLoader.load(parent.id);
};

export const getUserProfiles = async (parent: UserEntity, args: unknown, { dataLoader, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  return dataLoader.profilesLoader.load(parent.id);
};

export const getUserProfile = async (parent: UserEntity, args: unknown, { dataLoader, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const [profile] = await dataLoader.profilesLoader.load(parent.id);

  return profile || new GraphQLError(`User does not have a profile.`);
};

export const getUserMemberTypes = async (parent: UserEntity, args: unknown, { dataLoader, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const [profile] = await dataLoader.profilesLoader.load(parent.id);

  return dataLoader.memberTypesLoader.load(profile ? profile.memberTypeId : '');
};

export const getUserMemberType = async (parent: UserEntity, args: unknown, { dataLoader, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const [profile] = await dataLoader.profilesLoader.load(parent.id);
  const [memberType] = await dataLoader.memberTypesLoader.load(profile ? profile.memberTypeId : '');

  return memberType || new GraphQLError(`User does not have a profile with memberType`);
};

export const getUserSubscribedTo = async (parent: UserEntity, args: unknown, { dataLoader, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const users = await dataLoader.usersLoader.load('call');

  return users.filter((someUser) => someUser.subscribedToUserIds.includes(parent.id));
};

export const getSubscribedToUser = async (parent: UserEntity, args: unknown, { dataLoader, validationDepth }: ResolverContext) => {
  resolveValidationDepth(validationDepth);
  const users = await dataLoader.usersLoader.load('call');

  return users.filter((someUser) => parent.subscribedToUserIds.includes(someUser.id));
};
