import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createUserBodySchema, changeUserBodySchema, subscribeBodySchema } from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params as { id: string };
      return fastify.db.users.findOne({ key: 'id', equals: id }).then((item) => {
        if (!item) {
          return reply.code(404).send({ message: 'Not Found' });
        }
        return item;
      });
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return fastify.db.users.create(request.body as Omit<UserEntity, 'id' | 'subscribedToUserIds'>);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params as { id: string };
        const deletedUser = await fastify.db.users.delete(id);
        const relatedUsers = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: id });

        for (const user of relatedUsers) {
          const copyIds = [...user.subscribedToUserIds];
          const index = user.subscribedToUserIds.findIndex((item) => item === id);
          copyIds.splice(index, 1);

          await fastify.db.users.change(user.id, { subscribedToUserIds: [...copyIds] });
        }

        const relatedPosts = await fastify.db.posts.findMany({ key: 'userId', equals: id });
        for (const post of relatedPosts) {
          await fastify.db.posts.delete(post.id);
        }

        const relatedProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: id });
        if (relatedProfile) {
          await fastify.db.profiles.delete(relatedProfile.id);
        }

        return deletedUser;
      } catch {
        return reply.code(400).send({ message: 'Bad Request' });
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const { id: subscriberId } = request.params as { id: string };
        const { userId } = request.body as { userId: string };
        const subscriberUser = await fastify.db.users.findOne({ key: 'id', equals: subscriberId });
        const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

        if (subscriberUser && user) {
          if (user.subscribedToUserIds.includes(subscriberId)) throw new Error(`User already subscribed.`);
          if (subscriberId === userId) throw new Error(`You can't subscribe to yourself.`);

          const changedUser = await fastify.db.users.change(userId, {
            subscribedToUserIds: [...user.subscribedToUserIds, subscriberId],
          });

          return changedUser;
        } else {
          throw new Error();
        }
      } catch (error) {
        return reply.code(400).send({ message: (error as Error).message || 'Invalid user ids.' });
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const { id: subscriberId } = request.params as { id: string };
        const { userId } = request.body as { userId: string };
        const subscriberUser = await fastify.db.users.findOne({ key: 'id', equals: subscriberId });
        const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

        if (subscriberUser && user) {
          if (!user.subscribedToUserIds.includes(subscriberId)) throw new Error('Not found subscriber for unsubscribe from follow.');

          const copyIds = [...user.subscribedToUserIds];
          const index = user.subscribedToUserIds.findIndex((item) => item === subscriberId);
          copyIds.splice(index, 1);

          const changedUser = await fastify.db.users.change(userId, { subscribedToUserIds: [...copyIds] });

          return changedUser;
        } else {
          throw new Error();
        }
      } catch (error) {
        return reply.code(400).send({ message: (error as Error).message || 'Invalid user ids.' });
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params as { id: string };
      const partialUser = request.body as Partial<Omit<UserEntity, 'id'>>;
      return fastify.db.users.change(id, partialUser).catch(() => {
        return reply.code(400).send({ message: 'Bad Request' });
      });
    }
  );
};

export default plugin;
