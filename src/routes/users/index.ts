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
      const { id } = request.params;
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
      return fastify.db.users.create(request.body);
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
        const { id } = request.params;
        const deletedUser = await fastify.db.users.delete(id);
        const relatedUsers = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: id });

        for (const user of relatedUsers) {
          const copyIds = [...user.subscribedToUserIds];
          const index = user.subscribedToUserIds.findIndex((item) => item === id);
          copyIds.splice(index, 1);

          await fastify.db.users.change(user.id, { subscribedToUserIds: [...copyIds] });
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
        const { id: subscriberId } = request.params;
        const { userId } = request.body;
        const subscriberUser = await fastify.db.users.findOne({ key: 'id', equals: subscriberId });
        const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

        if (subscriberUser && user) {
          if (user.subscribedToUserIds.includes(subscriberId)) throw new Error();

          const changedUser = await fastify.db.users.change(userId, {
            subscribedToUserIds: [...user.subscribedToUserIds, subscriberId],
          });

          return changedUser;
        } else {
          throw new Error();
        }
      } catch {
        return reply.code(400).send({ message: 'Bad Request' });
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
        const { id: subscriberId } = request.params;
        const { userId } = request.body;
        const subscriberUser = await fastify.db.users.findOne({ key: 'id', equals: subscriberId });
        const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

        if (subscriberUser && user) {
          if (!user.subscribedToUserIds.includes(subscriberId)) throw new Error();

          const copyIds = [...user.subscribedToUserIds];
          const index = user.subscribedToUserIds.findIndex((item) => item === subscriberId);
          copyIds.splice(index, 1);

          const changedUser = await fastify.db.users.change(userId, { subscribedToUserIds: [...copyIds] });

          return changedUser;
        } else {
          throw new Error();
        }
      } catch {
        return reply.code(400).send({ message: 'Bad Request' });
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
      const { id } = request.params;
      const partialUser = request.body;
      return fastify.db.users.change(id, partialUser).catch(() => {
        return reply.code(400).send({ message: 'Bad Request' });
      });
    }
  );
};

export default plugin;
