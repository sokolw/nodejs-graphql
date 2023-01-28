import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, 
  changePostBodySchema 
} from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      return fastify.db.posts.findOne({ key: 'id', equals: id }).then((item) => {
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
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const userPost = request.body;
        const user = await fastify.db.users.findOne({ key: 'id', equals: userPost.userId });
        if (!user) throw new Error(`Such user does not exist`);

        return fastify.db.posts.create(userPost);
      } catch (error) {
        return reply.code(404).send({ message: (error as Error).message || 'Not Found' });
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
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      return fastify.db.posts.delete(id).catch(() => {
        return reply.code(400).send({ message: 'Bad Request' });
      });
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      const partialPost = request.body;
      return fastify.db.posts.change(id, partialPost).catch((error) => {
        return reply.code(400).send({ message: (error as Error).message || 'Bad Request' });
      });
    }
  );
};

export default plugin;
