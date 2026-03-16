import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, '../..');
export const PROJECTS_DIR = path.join(ROOT_DIR, 'src/content/projects');

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function collectLegacyBentoProjectIds() {
  const files = await collectMarkdownFiles(PROJECTS_DIR);
  const ids = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);
    const hasStoredLayout = Array.isArray(parsed.data?.bento?.layout?.blocks) && parsed.data.bento.layout.blocks.length > 0;

    if (parsed.data?.useBentoLayout === true && !hasStoredLayout) {
      ids.push(path.relative(PROJECTS_DIR, filePath).replaceAll('\\', '/'));
    }
  }

  return ids.sort((left, right) => left.localeCompare(right));
}
