import fm from 'front-matter';
import { md } from '../services/md.js';
import { findFiles, getFile, fromRoot } from './files.js';

const POSTS_DIR = fromRoot('posts-repo');
const options = { year: 'numeric', month: 'short', day: '2-digit' };

function sortByDate(a, b) {
  if (a.date > b.date) return -1;
  if (a.date < b.date) return 1;
  return 0;
}

function urlify(file) {
  return file.replace('.md', '');
}

function preparePost({ file, content }) {
  const data = fm(content);
  const date = new Date(data.attributes.date);
  const html = md.render(data.body);
  const url = urlify(file);
  const formattedDate = date.toLocaleDateString('en-US', options);

  return {
    ...data.attributes,
    url,
    date,
    html,
    formattedDate,
  };
}

export async function getAllPosts() {
  const files = await findFiles(POSTS_DIR);

  const posts = [];
  for (const file of files) {
    if (!file) continue;
    const content = await getFile(POSTS_DIR, file);
    posts.push({ file, content });
  }

  return posts.map(preparePost).sort(sortByDate);
}

export async function getAllUrls() {
  const files = await findFiles(POSTS_DIR);

  return files.filter(Boolean);
}
