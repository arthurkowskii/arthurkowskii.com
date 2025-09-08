#!/usr/bin/env node

/**
 * Build validation script for SSR (Server-Side Rendering) builds
 * Validates that the build output is correct and catches common issues
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');

let errors = 0;
let warnings = 0;

function error(message) {
  console.error(`❌ ERROR: ${message}`);
  errors++;
}

function warn(message) {
  console.warn(`⚠️  WARNING: ${message}`);
  warnings++;
}

function success(message) {
  console.log(`✅ ${message}`);
}

// Check if dist directory exists
if (!existsSync(distDir)) {
  error('dist directory not found. Run npm run build first.');
  process.exit(1);
}

// Check SSR build structure (client/server split)
const clientDir = join(distDir, 'client');
const serverDir = join(distDir, 'server');

if (!existsSync(clientDir)) {
  error('client directory missing in SSR build');
} else {
  success('Found client directory');
}

if (!existsSync(serverDir)) {
  error('server directory missing in SSR build');
} else {
  success('Found server directory');
}

// Check essential client-side files
const essentialClientFiles = [
  'client/_astro',
  'client/manifest.json',
  'client/sw.js',
  'client/favicon.svg',
  'client/admin',
  'client/api'
];

for (const file of essentialClientFiles) {
  const filePath = join(distDir, file);
  if (!existsSync(filePath)) {
    error(`Essential client file missing: ${file}`);
  } else {
    success(`Found ${file}`);
  }
}

// Check essential server-side files
const essentialServerFiles = [
  'server/entry.mjs',
  'server/renderers.mjs',
  'server/pages',
  'server/chunks'
];

for (const file of essentialServerFiles) {
  const filePath = join(distDir, file);
  if (!existsSync(filePath)) {
    error(`Essential server file missing: ${file}`);
  } else {
    success(`Found ${file}`);
  }
}

// Check for manifest file (name includes dynamic hash)
if (existsSync(serverDir)) {
  const manifestFiles = readdirSync(serverDir).filter(f => f.startsWith('manifest_') && f.endsWith('.mjs'));
  if (manifestFiles.length === 0) {
    error('No server manifest file found (manifest_*.mjs)');
  } else {
    success(`Found server manifest: ${manifestFiles[0]}`);
  }
}

// Check JavaScript bundles in client/_astro
const astroDir = join(distDir, 'client', '_astro');
if (existsSync(astroDir)) {
  const jsFiles = readdirSync(astroDir).filter(f => f.endsWith('.js'));
  if (jsFiles.length === 0) {
    warn('No JavaScript bundles found in client/_astro directory');
  } else {
    success(`Found ${jsFiles.length} JavaScript bundles in client/_astro`);
  }
  
  // Check CSS files
  const cssFiles = readdirSync(astroDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length === 0) {
    warn('No CSS files found in client/_astro directory');
  } else {
    success(`Found ${cssFiles.length} CSS files in client/_astro`);
  }
}

// Validate server entry point
const entryPath = join(distDir, 'server', 'entry.mjs');
if (existsSync(entryPath)) {
  try {
    const entryContent = readFileSync(entryPath, 'utf8');
    
    // Check for basic server entry structure
    if (!entryContent.includes('export') && !entryContent.includes('import')) {
      error('server/entry.mjs: Missing ES module exports/imports');
    } else {
      success('Validated server/entry.mjs structure');
    }
    
  } catch (err) {
    error(`Failed to validate server entry: ${err.message}`);
  }
}

// Check server pages directory
const serverPagesDir = join(distDir, 'server', 'pages');
if (existsSync(serverPagesDir)) {
  const pageFiles = readdirSync(serverPagesDir, { recursive: true })
    .filter(file => typeof file === 'string' && file.endsWith('.mjs'));
  
  if (pageFiles.length === 0) {
    error('No page files found in server/pages directory');
  } else {
    success(`Found ${pageFiles.length} server page files`);
  }
}

// Check static assets
const staticAssets = ['client/images', 'client/CV.jpg'];
for (const asset of staticAssets) {
  const assetPath = join(distDir, asset);
  if (existsSync(assetPath)) {
    success(`Found static asset: ${asset}`);
  } else {
    warn(`Static asset missing: ${asset}`);
  }
}

// Check file sizes for potential issues
function checkFileSize(filePath, fileName, maxSizeMB = 10) {
  if (existsSync(filePath)) {
    const stats = statSync(filePath);
    const sizeMB = stats.size / (1024 * 1024);
    
    if (sizeMB > maxSizeMB) {
      warn(`${fileName} is large (${sizeMB.toFixed(2)}MB) - consider optimization`);
    }
  }
}

// Check bundle sizes
if (existsSync(astroDir)) {
  const jsFiles = readdirSync(astroDir).filter(f => f.endsWith('.js'));
  for (const jsFile of jsFiles) {
    checkFileSize(join(astroDir, jsFile), `client/_astro/${jsFile}`, 5);
  }
}

// Validate manifest.json
const manifestPath = join(distDir, 'client', 'manifest.json');
if (existsSync(manifestPath)) {
  try {
    const manifestContent = readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    if (!manifest.name || !manifest.short_name) {
      warn('manifest.json: Missing name or short_name');
    }
    
    if (!manifest.icons || manifest.icons.length === 0) {
      warn('manifest.json: Missing icons');
    }
    
    success('Validated manifest.json');
    
  } catch (err) {
    error(`Failed to validate manifest.json: ${err.message}`);
  }
}

// Summary
console.log('\n--- SSR Build Validation Summary ---');
if (errors > 0) {
  console.error(`❌ ${errors} error(s) found`);
}
if (warnings > 0) {
  console.warn(`⚠️  ${warnings} warning(s) found`);
}
if (errors === 0 && warnings === 0) {
  console.log('✅ SSR build validation passed successfully!');
}
if (errors === 0 && warnings > 0) {
  console.log('✅ SSR build is valid (with warnings)');
}

process.exit(errors > 0 ? 1 : 0);