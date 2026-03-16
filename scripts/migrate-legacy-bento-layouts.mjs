import { collectLegacyBentoProjectIds } from './lib/legacy-bento-layouts.mjs';
import {
  readProjectFile,
  saveProjectFile,
} from '../src/studio/server/project-files.js';

const ids = await collectLegacyBentoProjectIds();

if (!ids.length) {
  console.log('No legacy bento projects require layout migration.');
  process.exit(0);
}

console.log(`Migrating ${ids.length} legacy bento project(s)...`);

for (const id of ids) {
  console.log(`- ${id}`);
  const document = await readProjectFile(id);
  await saveProjectFile({ document });
}

const remaining = await collectLegacyBentoProjectIds();

if (remaining.length) {
  console.error('Migration completed with unresolved legacy projects:');
  remaining.forEach((id) => console.error(`- ${id}`));
  process.exit(1);
}

console.log('Legacy bento layout migration complete.');
