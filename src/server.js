import { pov, povConfig } from './services/views.js';
import { staticPlugin, staticConfig } from './services/static.js';
import { getCss } from './data-layer/css.js';
import { getAllPosts } from './data-layer/posts.js';

export default async function server(fastify, options) {
  const postsCache = await getAllPosts();
  const styleRaw = getCss();

  const viewGlobalOptions = { styleRaw, blogBaseUrl: process.env.BLOG_BASEURL || '/' };

  fastify.register(pov, povConfig);
  fastify.register(staticPlugin, staticConfig);

  fastify.get('/', (request, reply) => {
    reply.view('list.hbs', { posts: postsCache, ...viewGlobalOptions });
  });

  fastify.get('/:postName', (request, reply) => {
    const post = postsCache.find((p) => p.url === request.params.postName);

    reply.view('single.hbs', { post, ...viewGlobalOptions });
  });
}
