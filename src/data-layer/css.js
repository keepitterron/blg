import uglify from 'uglifycss';
import { fromRoot } from './files.js';

const cssPath = fromRoot('views/index.css');

export function getCss() {
  const uglifyOptions = { maxLineLen: 500, expandVars: false };
  return uglify.processFiles([cssPath], uglifyOptions);
}
