import { readdir, rmdir, readFile, mkdir, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = path.join(__dirname, '../');
const __dist = path.join(__root, '../dist');

export function fromRoot(dest) {
  return path.join(__root, dest);
}

export function findFiles(filesPath) {
  return readdir(filesPath);
}

export function getFile(dir, file) {
  return readFile(path.join(dir, file), { encoding: 'utf-8' });
}

export async function createDist() {
  await rmdir(__dist, { recursive: true }).catch(() => {});
  return mkdir(__dist);
}

export function createPost(fileName, fileContent) {
  const filePath = path.join(__dist, fileName);
  return writeFile(filePath, fileContent, { encoding: 'utf-8' });
}
