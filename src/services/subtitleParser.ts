import type { SubtitleCue } from '../types';

function parseTimestamp(ts: string): number {
  const parts = ts.trim().replace(',', '.').split(':');
  if (parts.length === 3) {
    return (
      parseFloat(parts[0]) * 3600 +
      parseFloat(parts[1]) * 60 +
      parseFloat(parts[2])
    );
  }
  if (parts.length === 2) {
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(parts[0]);
}

export function parseSRT(content: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  const blocks = content.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 2) continue;

    const timeLineIdx = lines.findIndex(l => l.includes('-->'));
    if (timeLineIdx === -1) continue;

    const timeParts = lines[timeLineIdx].split('-->');
    if (timeParts.length !== 2) continue;

    const start = parseTimestamp(timeParts[0]);
    const end = parseTimestamp(timeParts[1]);
    const text = lines.slice(timeLineIdx + 1).join('\n').replace(/<[^>]+>/g, '');

    if (!isNaN(start) && !isNaN(end) && text) {
      cues.push({ start, end, text });
    }
  }

  return cues;
}

export function parseVTT(content: string): SubtitleCue[] {
  const cleaned = content.replace(/^WEBVTT.*\n/m, '').replace(/^NOTE.*\n(?:.*\n)*?\n/gm, '');
  return parseSRT(cleaned);
}

export function parseSubtitle(content: string, filename: string): SubtitleCue[] {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'vtt') return parseVTT(content);
  return parseSRT(content);
}
