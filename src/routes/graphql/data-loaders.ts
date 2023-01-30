import * as DataLoader from 'dataloader';
import { FastifyInstance } from 'fastify';

export const connectDataLoaders = (fastify: FastifyInstance) => {
  return {
    postsLoader: new DataLoader(async (ids: readonly string[]) => {
      const posts = await fastify.db.posts.findMany();
      return ids.map((id) => posts.filter((post) => post.userId === id));
    }),

    profilesLoader: new DataLoader(async (ids: readonly string[]) => {
      const profiles = await fastify.db.profiles.findMany();
      return ids.map((id) => profiles.filter((profile) => profile.userId === id));
    }),

    memberTypesLoader: new DataLoader(async (ids: readonly string[]) => {
      const memberTypes = await fastify.db.memberTypes.findMany();
      return ids.map((id) => memberTypes.filter((memberType) => memberType.id === id));
    }),

    usersLoader: new DataLoader(async (calls: readonly string[]) => {
      const users = await fastify.db.users.findMany();
      return calls.map(() => users);
    }),
  };
};
