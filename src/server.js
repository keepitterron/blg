import ws from 'fastify-websocket';

import { pov, povConfig } from './services/views.js';
import { staticPlugin, staticConfig } from './services/static.js';
import { getCss } from './data-layer/css.js';
import { getAllPosts } from './data-layer/posts.js';
import { htmlToAbsoluteUrls, buildFeedXML, FEED_CONTENT_TYPE } from './services/feed.js';

const { BLOG_BASEURL = 'http://localhost:3000' } = process.env;

export default async function server(fastify, options) {
  const postsCache = await getAllPosts();

  const styleRaw = getCss();

  const viewGlobalOptions = { styleRaw, fastRefresh: !options.noTracker };

  const postsWithAbsoluteUrls = await Promise.all(postsCache.map(async (post) => ({
    ...post,
    html: await htmlToAbsoluteUrls(post.html, BLOG_BASEURL),
  })));

  fastify.register(pov, povConfig);
  fastify.register(staticPlugin, staticConfig);
  fastify.register(ws);

  fastify.get('/', (request, reply) => {
    reply.view('list.hbs', { posts: postsCache, ...viewGlobalOptions });
  });

  fastify.get('/:postName', (request, reply) => {
    const post = postsCache.find((p) => p.url === request.params.postName);

    reply.view('single.hbs', { post, ...viewGlobalOptions });
  });

  fastify.get('/ws', { websocket: true }, () => {});

  fastify.get('/feed.xml', (request, reply) => {
    reply
      .header('content-type', FEED_CONTENT_TYPE)
      .send(buildFeedXML({
        title: 'C//S Blog',
        updated: new Date().toISOString(),
        author: 'Claudio Semeraro',
        baseUrl: BLOG_BASEURL,
        feedPath: '/feed.xml',
        posts: postsWithAbsoluteUrls,
      }));
  });
}
