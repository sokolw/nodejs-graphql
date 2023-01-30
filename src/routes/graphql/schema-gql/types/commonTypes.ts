import { FastifyInstance } from 'fastify';
import { GraphQLError } from 'graphql';
import * as DataLoader from 'dataloader';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';

export interface ResolverContext {
  fastify: FastifyInstance;
  validationDepth: ReadonlyArray<GraphQLError>;
  dataLoader: {
    postsLoader: DataLoader<string, PostEntity[], string>;
    profilesLoader: DataLoader<string, ProfileEntity[], string>;
    memberTypesLoader: DataLoader<string, MemberTypeEntity[], string>;
    usersLoader: DataLoader<string, UserEntity[], string>;
  };
}
