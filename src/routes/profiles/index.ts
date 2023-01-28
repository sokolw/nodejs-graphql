import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      return fastify.db.profiles.findOne({ key: 'id', equals: id }).then((item) => {
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
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const userProfile = request.body;
        const user = await fastify.db.users.findOne({ key: 'id', equals: userProfile.userId });
        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: userProfile.memberTypeId });
        const existUserProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: userProfile.userId });
        if (!user) throw new Error(`Such user does not exist.`);
        if (!memberType) throw new Error(`Such memberType does not exist.`);
        if (existUserProfile) throw new Error(`The user already has a profile.`);

        return fastify.db.profiles.create(userProfile);
      } catch (error) {
        return reply.code(400).send({ message: (error as Error).message || 'Bad Request' });
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      return fastify.db.profiles.delete(id).catch(() => {
        return reply.code(400).send({ message: 'Bad Request' });
      });
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const { id } = request.params;
        const partialProfile = request.body;

        if (partialProfile.memberTypeId) {
          const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: partialProfile.memberTypeId });
          if (!memberType) throw new Error(`Such memberType does not exist.`);
        }

        return await fastify.db.profiles.change(id, partialProfile);
      } catch (error) {
        return reply.code(400).send({ message: (error as Error).message || 'Bad Request' });
      }
    }
  );
};

export default plugin;
