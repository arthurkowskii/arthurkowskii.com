import { collectLegacyBentoProjectIds } from './lib/legacy-bento-layouts.mjs';

const ids = await collectLegacyBentoProjectIds();

if (!ids.length) {
  console.log('All useBentoLayout projects have explicit bento.layout.blocks.');
  process.exit(0);
}

console.error('Projects missing explicit bento.layout.blocks:');
ids.forEach((id) => console.error(`- ${id}`));
process.exit(1);
