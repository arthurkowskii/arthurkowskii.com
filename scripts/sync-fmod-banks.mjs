#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const sourceDir = join(projectRoot, "FMOD_PROJECTS", "FMOD-BOSS", "Build", "Desktop");
const targetDir = join(projectRoot, "public", "fmod", "FMOD-BOSS");
const bankFiles = ["Master.bank", "Master.strings.bank"];

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function shortHash(filePath) {
  return sha256(filePath).slice(0, 12);
}

function formatFileInfo(filePath) {
  const stats = statSync(filePath);
  return `${stats.size} bytes | ${stats.mtime.toISOString()} | ${shortHash(filePath)}`;
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function info(message) {
  console.log(message);
}

if (!existsSync(sourceDir)) {
  fail(`Source FMOD build directory not found: ${sourceDir}`);
}

mkdirSync(targetDir, { recursive: true });

bankFiles.forEach((bankFile) => {
  const sourcePath = join(sourceDir, bankFile);
  const targetPath = join(targetDir, bankFile);

  if (!existsSync(sourcePath)) {
    fail(`Missing source bank: ${sourcePath}`);
  }

  info(`\nSyncing ${bankFile}`);
  info(`Source: ${formatFileInfo(sourcePath)}`);

  if (existsSync(targetPath)) {
    const sourceHash = shortHash(sourcePath);
    const targetHash = shortHash(targetPath);
    if (sourceHash !== targetHash) {
      info(`Target before copy: ${formatFileInfo(targetPath)}`);
      info(`Hash mismatch detected for ${bankFile}. Overwriting public copy.`);
    } else {
      info(`Target already matches source: ${formatFileInfo(targetPath)}`);
    }
  } else {
    info(`Target before copy: missing`);
  }

  copyFileSync(sourcePath, targetPath);

  const sourceHash = sha256(sourcePath);
  const targetHash = sha256(targetPath);
  if (sourceHash !== targetHash) {
    fail(`Post-copy verification failed for ${bankFile}`);
  }

  info(`Target after copy: ${formatFileInfo(targetPath)}`);
});

info("\nFMOD bank sync complete.");
