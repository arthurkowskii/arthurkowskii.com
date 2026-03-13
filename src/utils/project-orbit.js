function parseDomainFolder(folder) {
  const source = String(folder || '').trim();
  const match = source.match(/^(\d+)[-_ ]?(.*)$/);
  const order = match ? parseInt(match[1], 10) : null;
  const nameRaw = (match ? match[2] : source) || '';
  const name = nameRaw.trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const display = name.replace(/[-_]+/g, ' ').trim().toUpperCase();
  return { order, name, slug, display };
}

function sanitizeAngle(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function getProjectSortValue(project) {
  const orbitOrder = project.data?.orbit?.order;
  if (typeof orbitOrder === 'number' && Number.isFinite(orbitOrder)) return orbitOrder;
  const dateValue = project.data?.date ? new Date(project.data.date).getTime() : null;
  if (typeof dateValue === 'number' && Number.isFinite(dateValue)) return dateValue;
  return project.slug;
}

export function buildDomainMeta(projects = [], maxShells = 5) {
  const domainMap = new Map();

  const projectsWithDomains = projects.map((project) => {
    const folder = (project.id?.split('/')?.[0] || '').trim();
    const meta = parseDomainFolder(folder);
    if (meta.slug && !domainMap.has(meta.slug)) domainMap.set(meta.slug, meta);

    return {
      ...project,
      folderDomain: meta.slug || 'misc',
      folderMeta: meta,
      data: {
        ...project.data,
        domain: meta.slug || 'misc',
      },
    };
  });

  let domainMetaList = Array.from(domainMap.values());
  domainMetaList.sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name);
  });

  return {
    domainMetaList: domainMetaList.slice(0, maxShells),
    projectsWithDomains,
  };
}

export function normalizeOrbitForProject(project, domains = []) {
  const orbit = project.data?.orbit || {};
  const manualShell = orbit.shellMode === 'manual' && typeof orbit.shell === 'number'
    ? Math.max(1, Math.min(domains.length || 5, Math.floor(orbit.shell)))
    : null;
  const folderShellIndex = Math.max(0, domains.indexOf(project.data?.domain || project.folderDomain || 'misc'));
  const shellIndex = manualShell ? manualShell - 1 : folderShellIndex;

  return {
    shellIndex,
    shell: shellIndex + 1,
    angleMode: orbit.angleMode === 'fixed' ? 'fixed' : 'auto',
    angle: orbit.angleMode === 'fixed' ? sanitizeAngle(orbit.angle) : null,
    order: typeof orbit.order === 'number' && Number.isFinite(orbit.order) ? orbit.order : null,
  };
}

export function buildOrbitCollections(projects = [], domains = []) {
  const groupedByShell = new Map();

  projects.forEach((project) => {
    const orbit = normalizeOrbitForProject(project, domains);
    const shellIndex = orbit.shellIndex;
    if (!groupedByShell.has(shellIndex)) groupedByShell.set(shellIndex, []);
    groupedByShell.get(shellIndex).push({ ...project, orbit });
  });

  const shellProjects = domains.map((_, shellIndex) => {
    const shellEntries = groupedByShell.get(shellIndex) || [];
    return shellEntries.sort((a, b) => {
      const av = getProjectSortValue(a);
      const bv = getProjectSortValue(b);
      if (typeof av === 'number' && typeof bv === 'number') return av - bv;
      return String(av).localeCompare(String(bv));
    });
  });

  return shellProjects;
}

export function computeAnglesForShell(projects = []) {
  if (!Array.isArray(projects) || projects.length === 0) return [];

  const fixed = [];
  const auto = [];
  projects.forEach((project, index) => {
    const angle = project.orbit?.angle;
    if (project.orbit?.angleMode === 'fixed' && angle !== null && angle !== undefined) {
      fixed.push({ index, angle });
    } else {
      auto.push(index);
    }
  });

  const allAngles = new Array(projects.length).fill(0);
  fixed.forEach(({ index, angle }) => {
    allAngles[index] = angle;
  });

  if (auto.length === 0) return allAngles;

  const autoCount = auto.length;
  const step = 360 / autoCount;
  auto.forEach((projectIndex, autoIndex) => {
    allAngles[projectIndex] = sanitizeAngle(autoIndex * step) || 0;
  });

  return allAngles;
}

export { parseDomainFolder };
