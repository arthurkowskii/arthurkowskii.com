const GRID_COLUMNS = 12;
const GRID_ROW_HEIGHT = 88;
const GRID_GAP = 12;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function copyPlacement(placement) {
  return {
    x: placement.x,
    y: placement.y,
    w: placement.w,
    h: placement.h,
  };
}

function overlaps(a, b) {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

export function resolveDesktopCollisions(blocks, activeBlockId) {
  const nextBlocks = blocks.map((block) => ({
    ...block,
    placement: {
      ...block.placement,
      desktop: copyPlacement(block.placement.desktop),
    },
  }));

  const active = nextBlocks.find((block) => block.id === activeBlockId);
  if (!active) return nextBlocks;

  const queue = [active];
  while (queue.length) {
    const current = queue.shift();
    nextBlocks.forEach((candidate) => {
      if (candidate.id === current.id) return;
      const currentPlacement = current.placement.desktop;
      const candidatePlacement = candidate.placement.desktop;
      if (!overlaps(currentPlacement, candidatePlacement)) return;
      candidatePlacement.y = currentPlacement.y + currentPlacement.h;
      queue.push(candidate);
    });
  }

  return nextBlocks;
}

export function createDesktopGridEditor({
  root,
  getBlocks,
  getConstraints,
  onSelect,
  onPreview,
  onCommit,
}) {
  let selectedBlockId = null;
  let interaction = null;

  function getCellWidth() {
    const width = root.clientWidth;
    return (width - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  }

  function getBlockNode(blockId) {
    return root.querySelector(`[data-block-id="${blockId}"]`);
  }

  function pxToGrid(deltaX, deltaY) {
    const cellWidth = getCellWidth();
    return {
      dx: Math.round(deltaX / (cellWidth + GRID_GAP)),
      dy: Math.round(deltaY / (GRID_ROW_HEIGHT + GRID_GAP)),
    };
  }

  function clampPlacement(block, placement) {
    const constraints = getConstraints(block.type);
    const maxW = Math.min(constraints.maxW || GRID_COLUMNS, GRID_COLUMNS);
    const minW = Math.min(constraints.minW || 1, maxW);
    const minH = constraints.minH || 1;
    const w = clamp(placement.w, minW, maxW);
    const x = clamp(placement.x, 0, GRID_COLUMNS - w);
    return {
      x,
      y: Math.max(0, placement.y),
      w,
      h: Math.max(minH, placement.h),
    };
  }

  function applyInteraction(event) {
    if (!interaction) return;
    const { dx, dy } = pxToGrid(
      event.clientX - interaction.startX,
      event.clientY - interaction.startY,
    );

    const blocks = getBlocks();
    const block = blocks.find((item) => item.id === interaction.blockId);
    if (!block) return;

    const nextPlacement = copyPlacement(interaction.origin);
    if (interaction.mode === 'move') {
      nextPlacement.x += dx;
      nextPlacement.y += dy;
    } else {
      if (interaction.mode.includes('e')) nextPlacement.w += dx;
      if (interaction.mode.includes('s')) nextPlacement.h += dy;
    }

    block.placement.desktop = clampPlacement(block, nextPlacement);
    onPreview(block.id);
  }

  function endInteraction() {
    if (!interaction) return;
    onCommit(interaction.blockId);
    interaction = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(event) {
    event.preventDefault();
    applyInteraction(event);
  }

  function onPointerUp() {
    endInteraction();
  }

  function startInteraction(blockId, mode, event) {
    const blocks = getBlocks();
    const block = blocks.find((item) => item.id === blockId);
    if (!block) return;
    selectedBlockId = blockId;
    onSelect(blockId);
    interaction = {
      blockId,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: copyPlacement(block.placement.desktop),
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  }

  function render() {
    const blocks = getBlocks();
    const maxRow = blocks.reduce((value, block) => {
      const placement = block.placement.desktop;
      return Math.max(value, placement.y + placement.h);
    }, 6);
    root.style.setProperty('--desktop-grid-rows', String(maxRow));
    root.innerHTML = '';

    blocks.forEach((block) => {
      const placement = block.placement.desktop;
      const node = document.createElement('button');
      node.type = 'button';
      node.className = `studio-grid-block${block.id === selectedBlockId ? ' is-selected' : ''}${block.enabled === false ? ' is-disabled' : ''}`;
      node.dataset.blockId = block.id;
      node.style.setProperty('--grid-x', String(placement.x + 1));
      node.style.setProperty('--grid-y', String(placement.y + 1));
      node.style.setProperty('--grid-w', String(placement.w));
      node.style.setProperty('--grid-h', String(placement.h));
      node.innerHTML = `
        <span class="studio-grid-block__label">${block.type}</span>
        <span class="studio-grid-block__meta">x${placement.x} y${placement.y} w${placement.w} h${placement.h}</span>
        <span class="studio-grid-block__handle studio-grid-block__handle--se" data-handle="se"></span>
        <span class="studio-grid-block__handle studio-grid-block__handle--e" data-handle="e"></span>
        <span class="studio-grid-block__handle studio-grid-block__handle--s" data-handle="s"></span>
      `;
      node.addEventListener('click', () => {
        selectedBlockId = block.id;
        onSelect(block.id);
        render();
      });
      node.addEventListener('pointerdown', (event) => {
        const handle = event.target.closest('[data-handle]');
        event.preventDefault();
        startInteraction(block.id, handle?.dataset.handle || 'move', event);
      });
      root.appendChild(node);
    });
  }

  return {
    render,
    setSelected(blockId) {
      selectedBlockId = blockId;
      render();
    },
    resolveAfterCommit(blockId) {
      const resolved = resolveDesktopCollisions(getBlocks(), blockId);
      const blocks = getBlocks();
      resolved.forEach((resolvedBlock) => {
        const target = blocks.find((item) => item.id === resolvedBlock.id);
        if (!target) return;
        target.placement.desktop = resolvedBlock.placement.desktop;
      });
      render();
    },
  };
}

export function getDesktopGridConstants() {
  return {
    columns: GRID_COLUMNS,
    rowHeight: GRID_ROW_HEIGHT,
    gap: GRID_GAP,
  };
}
