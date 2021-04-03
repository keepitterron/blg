import hlbr from 'handlebars';
import minifier from 'html-minifier';
import { fromRoot } from '../data-layer/files.js';

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
    handlebars: hlbr,
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
