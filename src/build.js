import fastify from 'fastify';
import server from './server.js';
import { getAllUrls } from './data-layer/posts.js';
import { createDist, createPost } from './data-layer/files.js';

const app = fastify();

async function build() {
  await server(app);
  await createDist();

  const index = await app.inject({
    method: 'GET',
    url: '/',
  });

  await createPost('index.html', index.body);

  const urls = await getAllUrls();
  for (const url of urls) {
    const post = await app.inject({
      method: 'GET',
      url: `/${url}`,
    });

    await createPost(`${url}/index.html`, post.body);
  }
}

build();
