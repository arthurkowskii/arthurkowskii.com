// @ts-check
import { defineConfig } from 'astro/config';
/** @typedef {import('node:http').IncomingMessage} IncomingMessage */
/** @typedef {import('node:http').ServerResponse} ServerResponse */
/** @typedef {import('vite').ViteDevServer} ViteDevServer */
import { getStudioBootstrap, readProjectFile, saveProjectFile, createProjectDraft, duplicateProject } from './src/studio/server/project-files.js';

/** @param {ServerResponse} res @param {unknown} payload @param {number} [status] */
function jsonResponse(res, payload, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

/** @param {IncomingMessage} req */
function readBody(req) {
  return new Promise((resolve, reject) => {
    /** @type {Uint8Array[]} */
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function studioMiddleware() {
  return {
    name: 'atom-portfolio-studio-middleware',
    /** @param {ViteDevServer} server */
    configureServer(server) {
      server.middlewares.use('/__studio', async (req, res) => {
        try {
          const url = req.url || '/';
          if (req.method === 'GET' && url === '/bootstrap') {
            jsonResponse(res, await getStudioBootstrap());
            return;
          }
          if (req.method === 'GET' && url.startsWith('/project')) {
            const projectId = new URL(`http://localhost${url}`).searchParams.get('id');
            jsonResponse(res, await readProjectFile(projectId));
            return;
          }
          if (req.method === 'GET' && url.startsWith('/draft')) {
            const preset = new URL(`http://localhost${url}`).searchParams.get('preset') || 'blank';
            jsonResponse(res, await createProjectDraft(preset));
            return;
          }
          if (req.method === 'GET' && url.startsWith('/duplicate')) {
            const projectId = new URL(`http://localhost${url}`).searchParams.get('id');
            jsonResponse(res, await duplicateProject(projectId));
            return;
          }
          if (req.method === 'POST' && url === '/save') {
            const payload = await readBody(req);
            jsonResponse(res, await saveProjectFile(payload));
            return;
          }

          jsonResponse(res, { error: 'Not found' }, 404);
        } catch (error) {
          jsonResponse(res, { error: error instanceof Error ? error.message : 'Studio request failed' }, 500);
        }
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Static site generation (default)
  // No adapter needed for static output
  vite: {
    plugins: [studioMiddleware()],
  },
});
