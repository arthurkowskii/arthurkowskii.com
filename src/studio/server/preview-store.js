const previewStore = new Map();

export function setPreviewDraft(sessionId, draft) {
  if (!sessionId) return;
  previewStore.set(sessionId, {
    ...draft,
    updatedAt: Date.now(),
  });
}

export function getPreviewDraft(sessionId) {
  if (!sessionId) return null;
  return previewStore.get(sessionId) || null;
}

export function clearPreviewDraft(sessionId) {
  if (!sessionId) return;
  previewStore.delete(sessionId);
}
