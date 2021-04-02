import { fromRoot } from '../data-layer/files.js';

export { default as staticPlugin } from 'fastify-static';

export const staticConfig = {
  root: fromRoot('assets'),
  prefix: '/assets/', // optional: default '/'
};
