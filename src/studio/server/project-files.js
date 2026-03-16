import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';
import { z } from 'astro/zod';

import { listPresetSummaries, PROJECT_PRESET_DEFINITIONS } from './project-presets.js';
import {
  buildProjectDraftFromStudioDocument,
  createBlankStudioDocument,
  createStudioDocument,
  getStudioPalette,
} from '../studio-document.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');
const PROJECTS_DIR = path.join(ROOT_DIR, 'src/content/projects');

const bilingualStringSchema = z.union([
  z.string(),
  z.object({
    fr: z.string().optional(),
    en: z.string().optional(),
  }),
]);

const projectInputSchema = z.object({
  title: bilingualStringSchema,
  altTitle: bilingualStringSchema.optional(),
  description: bilingualStringSchema,
  tech: z.array(z.string()).default([]),
  status: z.enum(['completed', 'in-progress', 'planned']),
  link: z.string().optional(),
  github: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().optional(),
  date: z.string(),
  useBentoLayout: z.boolean().default(true),
  orbit: z.object({
    shellMode: z.enum(['auto', 'manual']).optional(),
    shell: z.number().optional(),
    order: z.number().optional(),
    angleMode: z.enum(['auto', 'fixed']).optional(),
    angle: z.number().optional(),
  }).optional(),
  bento: z.object({
    layout: z.object({
      version: z.number().optional(),
      columns: z.object({
        desktop: z.number().optional(),
        tablet: z.number().optional(),
        mobile: z.number().optional(),
      }).optional(),
      blocks: z.array(z.object({
        id: z.string(),
        type: z.string(),
        enabled: z.boolean(),
        variant: z.string().optional(),
        placement: z.object({
          desktop: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }).optional(),
          tablet: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }).optional(),
          mobile: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }).optional(),
        }).optional(),
      }).passthrough()).optional(),
    }).optional(),
  }).passthrough().optional(),
}).passthrough();

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'new_project';
}

function sanitizeForYaml(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeForYaml(entry));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, sanitizeForYaml(entry)]),
    );
  }
  return value;
}

function normalizeDateValue(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return new Date().toISOString().slice(0, 10);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  return value;
}

function normalizeProjectFrontmatter(frontmatter) {
  const next = structuredClone(frontmatter || {});
  next.date = normalizeDateValue(next.date);

  if (typeof next.link === 'string') next.link = next.link.trim();
  if (typeof next.github === 'string') next.github = next.github.trim();

  if (Array.isArray(next?.bento?.stats)) {
    next.bento.stats = next.bento.stats.map((stat) => ({
      ...stat,
      value: stat?.value === undefined || stat?.value === null ? '' : String(stat.value),
    }));
  }

  if (Array.isArray(next?.bento?.audio?.tracks)) {
    next.bento.audio.tracks = next.bento.audio.tracks.map((track) => ({
      ...track,
      filename: track?.filename === undefined || track?.filename === null ? '' : String(track.filename),
      duration: track?.duration === undefined || track?.duration === null ? undefined : String(track.duration),
      artist: track?.artist === undefined || track?.artist === null ? undefined : String(track.artist),
    }));
  }

  if (Array.isArray(next?.bento?.musicLinks?.items)) {
    next.bento.musicLinks.items = next.bento.musicLinks.items.map((item) => ({
      ...item,
      text: item?.text === undefined || item?.text === null ? '' : String(item.text),
      url: item?.url === undefined || item?.url === null ? '' : String(item.url),
    }));
  }

  if (next?.bento?.actions?.primary) {
    next.bento.actions.primary = {
      ...next.bento.actions.primary,
      url: next.bento.actions.primary?.url === undefined || next.bento.actions.primary?.url === null
        ? ''
        : String(next.bento.actions.primary.url),
    };
  }

  if (next?.bento?.actions?.secondary) {
    next.bento.actions.secondary = {
      ...next.bento.actions.secondary,
      url: next.bento.actions.secondary?.url === undefined || next.bento.actions.secondary?.url === null
        ? ''
        : String(next.bento.actions.secondary.url),
    };
  }

  if (Array.isArray(next?.bento?.results?.items)) {
    next.bento.results.items = next.bento.results.items.map((item) => ({
      ...item,
      icon: item?.icon === undefined || item?.icon === null ? '' : String(item.icon),
    }));
  }

  return next;
}

function shouldQuoteYamlString(value, key = '') {
  if (value === '') return true;
  if (key === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  if (!/^[A-Za-z0-9 _./:-]+$/.test(value)) return true;
  if (/^(?:true|false|null|~|yes|no|on|off)$/i.test(value)) return true;
  if (/^[+-]?(?:\d+|\d*\.\d+)(?:e[+-]?\d+)?$/i.test(value)) return true;
  if (/^\d+(?::\d+)+$/.test(value)) return true;
  if (/^0\d+$/.test(value)) return true;
  return false;
}

function serializeValue(value, indent = 0, key = '') {
  const spacing = ' '.repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value
      .map((entry) => {
        if (entry && typeof entry === 'object') {
          const objectBody = serializeObject(entry, indent + 2);
          return `${spacing}-\n${objectBody}`;
        }
        return `${spacing}- ${serializeScalar(entry, key)}`;
      })
      .join('\n');
  }

  if (value && typeof value === 'object') {
    return `\n${serializeObject(value, indent + 2)}`;
  }

  return serializeScalar(value, key);
}

function serializeScalar(value, key = '') {
  if (typeof value === 'string') {
    if (!shouldQuoteYamlString(value, key) && !value.includes(': ')) return value;
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null) return 'null';
  return JSON.stringify(value);
}

function serializeObject(value, indent = 0) {
  const spacing = ' '.repeat(indent);
  return Object.entries(value)
    .filter(([, entry]) => entry !== undefined)
    .map(([key, entry]) => {
      if (Array.isArray(entry)) {
        if (entry.length === 0) return `${spacing}${key}: []`;
        return `${spacing}${key}:\n${serializeValue(entry, indent + 2, key)}`;
      }
      if (entry && typeof entry === 'object') {
        return `${spacing}${key}:\n${serializeObject(entry, indent + 2)}`;
      }
      return `${spacing}${key}: ${serializeScalar(entry, key)}`;
    })
    .join('\n');
}

function serializeProjectFile(frontmatter, body = '') {
  const sanitized = sanitizeForYaml(frontmatter);
  const yaml = serializeObject(sanitized, 0);
  const normalizedBody = body ? body.replace(/^\n+/, '') : '';
  return `---\n${yaml}\n---\n${normalizedBody ? `\n${normalizedBody}\n` : '\n'}`;
}

async function listDomainFolders() {
  const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

export async function listProjectFiles() {
  const folders = await listDomainFolders();
  const projects = [];

  for (const folder of folders) {
    const folderPath = path.join(PROJECTS_DIR, folder);
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith('.md')) continue;
      const fullPath = path.join(folderPath, file.name);
      const raw = await fs.readFile(fullPath, 'utf8');
      const parsed = matter(raw);
      projects.push({
        id: `${folder}/${file.name}`,
        slug: file.name.replace(/\.md$/, ''),
        folder,
        filePath: fullPath,
        title: parsed.data?.title || file.name.replace(/\.md$/, ''),
        description: parsed.data?.description || '',
        status: parsed.data?.status || 'planned',
        updatedAt: (await fs.stat(fullPath)).mtime.toISOString(),
      });
    }
  }

  return projects.sort((a, b) => a.id.localeCompare(b.id));
}

export async function readProjectFile(relativeId) {
  const normalizedId = String(relativeId || '').replace(/\\/g, '/');
  const fullPath = path.join(PROJECTS_DIR, normalizedId);
  const raw = await fs.readFile(fullPath, 'utf8');
  const parsed = matter(raw);

  return createStudioDocument({
    id: normalizedId,
    folder: normalizedId.split('/')[0],
    slug: path.basename(normalizedId, '.md'),
    frontmatter: normalizeProjectFrontmatter(parsed.data),
    body: parsed.content,
  });
}

export async function createProjectDraft(presetKey) {
  const preset =
    PROJECT_PRESET_DEFINITIONS.find((item) => item.key === presetKey) ||
    PROJECT_PRESET_DEFINITIONS[0];

  return {
    document: createBlankStudioDocument({
      folder: preset.domainFolder,
      slug: 'new_project',
      coreBlocks: preset.coreBlocks,
      body: '# New project\n',
      presetKey: preset.key,
    }),
    presets: listPresetSummaries(),
    domains: await listDomainFolders(),
  };
}

export async function duplicateProject(relativeId) {
  const source = await readProjectFile(relativeId);
  return {
    document: {
      ...structuredClone(source),
      id: null,
      slug: `${source.slug}_copy`,
      ui: {
        ...source.ui,
        selectedBlockId: source.blocks?.[0]?.id || null,
      },
    },
    sourceId: source.id,
    presets: listPresetSummaries(),
    domains: await listDomainFolders(),
  };
}

export async function saveProjectFile(payload) {
  const sourceDocument = payload?.document || payload;
  const projectDraft = buildProjectDraftFromStudioDocument(sourceDocument);
  const normalizedInput = normalizeProjectFrontmatter(projectDraft.frontmatter);
  const parsed = projectInputSchema.parse(normalizedInput);
  const safeFolder = projectDraft.folder || '3_tech';
  const existingSlug = sourceDocument?.id ? path.basename(String(sourceDocument.id), '.md') : '';
  const requestedSlug = String(projectDraft.slug || '').trim();
  const preserveExistingSlug = existingSlug && requestedSlug && requestedSlug === existingSlug;
  const safeSlug = preserveExistingSlug
    ? existingSlug
    : slugify(requestedSlug || sourceDocument?.id || parsed.title?.fr || parsed.title || 'new_project');
  const finalFrontmatter = {
    ...parsed,
    bento: parsed.bento,
  };

  const folderPath = path.join(PROJECTS_DIR, safeFolder);
  await fs.mkdir(folderPath, { recursive: true });

  const fileName = `${safeSlug}.md`;
  const filePath = path.join(folderPath, fileName);
  const relativeId = `${safeFolder}/${fileName}`;

  const fileContent = serializeProjectFile(finalFrontmatter, projectDraft.body);
  await fs.writeFile(filePath, fileContent, 'utf8');

  return {
    id: relativeId,
    folder: safeFolder,
    slug: safeSlug,
    filePath,
    document: createStudioDocument({
      id: relativeId,
      folder: safeFolder,
      slug: safeSlug,
      frontmatter: finalFrontmatter,
      body: projectDraft.body,
    }),
  };
}

export async function getStudioBootstrap() {
  return {
    projects: await listProjectFiles(),
    presets: listPresetSummaries(),
    domains: await listDomainFolders(),
    palette: getStudioPalette(),
  };
}
