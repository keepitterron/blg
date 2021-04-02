import hlbr from 'handlebars';
import { fromRoot } from '../data-layer/files.js';

export { default as pov } from 'point-of-view';
export const povConfig = {
  engine: {
    handlebars: hlbr,
  },
  layout: 'layout.hbs',
  options: {
    partials: {
      header: '_header.hbs',
    },
  },
  root: fromRoot('views'),
};
