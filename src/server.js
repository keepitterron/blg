import { pov, povConfig } from './services/views.js';
import { getCss } from './data-layer/css.js';
import { getAllPosts } from './data-layer/posts.js';

export default async function server(fastify) {
  const postsCache = await getAllPosts();
  const styleRaw = getCss();

  fastify.register(pov, povConfig);

  fastify.get('/', (request, reply) => {
    reply.view('list.hbs', { posts: postsCache, styleRaw });
  });

  fastify.get('/:postName', (request, reply) => {
    const post = postsCache.find((p) => p.url === request.params.postName);

    reply.view('single.hbs', { post, styleRaw });
  });
}
