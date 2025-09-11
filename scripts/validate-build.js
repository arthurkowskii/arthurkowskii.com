#!/usr/bin/env node

/**
 * Build validation script for static site builds
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

// Check for main index.html (root page)
const indexPath = join(distDir, 'index.html');
if (!existsSync(indexPath)) {
  error('Main index.html missing from build');
} else {
  success('Found main index.html');
}

// Check essential static files
const essentialStaticFiles = [
  '_astro',
  'manifest.json',
  'sw.js',
  'favicon.svg',
  'admin',
  'api'
];

for (const file of essentialStaticFiles) {
  const filePath = join(distDir, file);
  if (!existsSync(filePath)) {
    error(`Essential static file missing: ${file}`);
  } else {
    success(`Found ${file}`);
  }
}

// Check for important HTML pages
const essentialPages = [
  'bio/index.html',
  'projects',
  'en/index.html',
  'en/bio/index.html'
];

for (const page of essentialPages) {
  const pagePath = join(distDir, page);
  if (!existsSync(pagePath)) {
    error(`Essential page missing: ${page}`);
  } else {
    success(`Found ${page}`);
  }
}

// Check JavaScript bundles in _astro directory
const astroDir = join(distDir, '_astro');
if (existsSync(astroDir)) {
  const jsFiles = readdirSync(astroDir).filter(f => f.endsWith('.js'));
  if (jsFiles.length === 0) {
    warn('No JavaScript bundles found in _astro directory');
  } else {
    success(`Found ${jsFiles.length} JavaScript bundles in _astro`);
  }
  
  // Check CSS files
  const cssFiles = readdirSync(astroDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length === 0) {
    warn('No CSS files found in _astro directory');
  } else {
    success(`Found ${cssFiles.length} CSS files in _astro`);
  }
} else {
  error('_astro directory missing - JavaScript bundles not found');
}

// Validate project structure for bilingual support
const projectsDir = join(distDir, 'projects');
if (existsSync(projectsDir)) {
  const projectFiles = readdirSync(projectsDir);
  if (projectFiles.length === 0) {
    warn('No project pages found in projects directory');
  } else {
    success(`Found ${projectFiles.length} project pages`);
  }
} else {
  error('Projects directory missing');
}

// Check English version pages
const enProjectsDir = join(distDir, 'en', 'projects');
if (existsSync(enProjectsDir)) {
  const enProjectFiles = readdirSync(enProjectsDir);
  if (enProjectFiles.length === 0) {
    warn('No English project pages found');
  } else {
    success(`Found ${enProjectFiles.length} English project pages`);
  }
} else {
  error('English projects directory missing');
}

// Check static assets
const staticAssets = ['images', 'CV.jpg'];
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
    checkFileSize(join(astroDir, jsFile), `_astro/${jsFile}`, 5);
  }
}

// Validate manifest.json
const manifestPath = join(distDir, 'manifest.json');
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
console.log('\n--- Static Build Validation Summary ---');
if (errors > 0) {
  console.error(`❌ ${errors} error(s) found`);
}
if (warnings > 0) {
  console.warn(`⚠️  ${warnings} warning(s) found`);
}
if (errors === 0 && warnings === 0) {
  console.log('✅ Static build validation passed successfully!');
}
if (errors === 0 && warnings > 0) {
  console.log('✅ Static build is valid (with warnings)');
}

process.exit(errors > 0 ? 1 : 0);