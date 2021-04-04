import hbs from 'handlebars';
import minifier from 'html-minifier';
import { fromRoot } from '../data-layer/files.js';

hbs.registerHelper('defaultDescription', (description) => description || 'Tech lead at Loom');

export const minifierOpts = {
  removeComments: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
};

export { default as pov } from 'point-of-view';
export const povConfig = {
  engine: {
    handlebars: hbs,
  },
  layout: 'layout.hbs',
  options: {
    useHtmlMinifier: minifier,
    htmlMinifierOptions: minifierOpts,
    partials: {
      header: '_header.hbs',
    },
  },
  root: fromRoot('views'),
};
