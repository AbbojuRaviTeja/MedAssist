export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function titleFromMessage(content, maxLen = 44) {
  const text = content.replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + '…' : text;
}

function bucketLabel(timestamp) {
  const diffDays = Math.floor((Date.now() - timestamp) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return 'Previous 7 Days';
  return 'Older';
}

/**
 * Returns conversations grouped by recency label, sorted newest first.
 * @returns {Array<[label: string, convs: object[]]>}
 */
export function groupByDate(conversations) {
  const groups = {};
  [...conversations]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((conv) => {
      const label = bucketLabel(conv.updatedAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(conv);
    });
  return Object.entries(groups);
}
