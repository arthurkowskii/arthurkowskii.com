#!/usr/bin/env node

/**
 * Security validation script for the portfolio
 * Checks for common security issues and best practices
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

console.log('🔒 Running security validation...\n');

let hasErrors = false;
let hasWarnings = false;

function error(message) {
  console.log(`❌ ${message}`);
  hasErrors = true;
}

function warn(message) {
  console.log(`⚠️ ${message}`);
  hasWarnings = true;
}

function success(message) {
  console.log(`✅ ${message}`);
}

// Check 1: Validate CSP headers
try {
  const indexFile = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  
  if (indexFile.includes('Content-Security-Policy')) {
    success('CSP headers found in build');
    
    // Check for unsafe CSP directives
    if (indexFile.includes("'unsafe-eval'")) {
      warn('CSP allows unsafe-eval - consider removing if not needed');
    }
    
    if (indexFile.includes("'unsafe-inline'")) {
      warn('CSP allows unsafe-inline - required for current implementation');
    }
    
  } else {
    error('CSP headers missing from build');
  }
} catch (err) {
  error(`Could not validate CSP headers: ${err.message}`);
}

// Check 2: Validate _headers file
try {
  const headersFile = fs.readFileSync(path.join(ROOT, 'public', '_headers'), 'utf8');
  
  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options', 
    'Strict-Transport-Security',
    'Cross-Origin-Embedder-Policy'
  ];
  
  let missingHeaders = [];
  requiredHeaders.forEach(header => {
    if (!headersFile.includes(header)) {
      missingHeaders.push(header);
    }
  });
  
  if (missingHeaders.length === 0) {
    success('All security headers configured');
  } else {
    error(`Missing security headers: ${missingHeaders.join(', ')}`);
  }
  
} catch (err) {
  error(`Could not validate _headers file: ${err.message}`);
}

// Check 3: Scan for potential secrets in source code
try {
  const sensitivePatterns = [
    /password\s*[:=]\s*['"]/i,
    /secret\s*[:=]\s*['"]/i,
    /api[_-]?key\s*[:=]\s*['"]/i,
    /token\s*[:=]\s*['"]/i,
    /sk_[a-zA-Z0-9]{48}/,  // Stripe secret keys
    /pk_[a-zA-Z0-9]{48}/,  // Stripe public keys
    /AIza[0-9A-Za-z_-]{35}/, // Google API keys
  ];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !['node_modules', '.git', 'dist'].includes(item)) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && ['.js', '.ts', '.astro', '.json'].includes(path.extname(item))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        sensitivePatterns.forEach((pattern, index) => {
          if (pattern.test(content)) {
            warn(`Potential sensitive data in ${path.relative(ROOT, fullPath)} (pattern ${index + 1})`);
          }
        });
      }
    }
  }
  
  scanDirectory(path.join(ROOT, 'src'));
  success('Source code scan completed');
  
} catch (err) {
  warn(`Could not complete source code scan: ${err.message}`);
}

// Check 4: Validate admin interface security
try {
  const adminFile = fs.readFileSync(path.join(ROOT, 'dist', 'admin', 'index.html'), 'utf8');
  
  if (adminFile.includes('readonly')) {
    success('Admin interface has readonly security measures');
  } else {
    warn('Admin interface may not have adequate security controls');
  }
  
  // Check for admin-specific security headers
  if (adminFile.includes('X-Frame-Options')) {
    success('Admin interface has frame protection');
  } else {
    warn('Admin interface missing frame protection');
  }
  
} catch (err) {
  warn(`Could not validate admin interface: ${err.message}`);
}

// Check 5: Validate build artifacts don't contain sensitive data
try {
  const distFiles = [];
  
  function collectDistFiles(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        collectDistFiles(fullPath);
      } else if (['.html', '.js', '.json'].includes(path.extname(item))) {
        distFiles.push(fullPath);
      }
    }
  }
  
  collectDistFiles(path.join(ROOT, 'dist'));
  
  let foundSensitive = false;
  const sensitiveInBuild = [
    /localhost:\d+/,
    /127\.0\.0\.1:\d+/,
    /dev(?:elopment)?.*mode/i,
    /__DEV__/
  ];
  
  distFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    sensitiveInBuild.forEach(pattern => {
      if (pattern.test(content)) {
        warn(`Development reference in build: ${path.relative(ROOT, file)}`);
        foundSensitive = true;
      }
    });
  });
  
  if (!foundSensitive) {
    success('No development references found in build');
  }
  
} catch (err) {
  warn(`Could not validate build artifacts: ${err.message}`);
}

// Check 6: Validate performance monitoring security
try {
  const monitoringFile = fs.readFileSync(path.join(ROOT, 'src', 'utils', 'monitoring.js'), 'utf8');
  
  if (monitoringFile.includes('shouldEnable')) {
    success('Performance monitoring has proper enablement checks');
  } else {
    warn('Performance monitoring may always be enabled');
  }
  
  if (monitoringFile.includes('localStorage') && monitoringFile.includes('try {')) {
    success('Performance monitoring has safe localStorage usage');
  } else {
    warn('Performance monitoring localStorage usage may not be safe');
  }
  
} catch (err) {
  warn(`Could not validate monitoring security: ${err.message}`);
}

// Summary
console.log('\n--- Security Validation Summary ---');

if (hasErrors) {
  console.log('❌ Security validation FAILED - please fix errors above');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️ Security validation passed with warnings');
  console.log('Consider addressing warnings for improved security');
  process.exit(0);
} else {
  console.log('✅ Security validation PASSED');
  console.log('All security checks completed successfully');
  process.exit(0);
}