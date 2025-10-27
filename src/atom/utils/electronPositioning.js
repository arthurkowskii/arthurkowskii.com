// Electron positioning utilities
export function calculateElectronPositions(electronCount, minDistanceDegrees = 60) {
  if (electronCount === 0) return [];
  if (electronCount === 1) return [0];
  
  const fullCircleDegrees = 360;
  const totalMinSpace = minDistanceDegrees * electronCount;
  
  if (totalMinSpace >= fullCircleDegrees) {
    console.warn(`❌ FALLBACK: ${electronCount} × ${minDistanceDegrees}° = ${totalMinSpace}° > 360°. Using even distribution.`);
    return Array.from({ length: electronCount }, (_, i) => (i * fullCircleDegrees) / electronCount);
  }
  
  const remainingSpace = fullCircleDegrees - totalMinSpace;
  const extraSpacing = remainingSpace / electronCount;
  const actualSpacing = minDistanceDegrees + extraSpacing;
  
  const positions = [];
  for (let i = 0; i < electronCount; i++) {
    positions.push(i * actualSpacing);
  }
  
  const randomOffset = Math.random() * fullCircleDegrees;
  return positions.map(angle => (angle + randomOffset) % fullCircleDegrees);
}

/**
 * Convert angle from radians to degrees (for debugging)
 */
export function radiansToDegrees(radians) {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate the actual distance in degrees between two positions on a circle
 */
export function calculateAngularDistance(angle1, angle2) {
  const diff = Math.abs(angle2 - angle1);
  const distance = Math.min(diff, 2 * Math.PI - diff);
  return (distance * 180) / Math.PI;
}