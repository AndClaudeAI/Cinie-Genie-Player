import type { Channel } from '../types';

export function parseM3U(content: string): Channel[] {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const channels: Channel[] = [];

  if (!lines[0]?.startsWith('#EXTM3U')) return channels;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('#EXTINF:')) continue;

    const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
    const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
    const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
    const groupMatch = line.match(/group-title="([^"]*)"/);
    const nameMatch = line.match(/,(.+)$/);

    const url = lines[i + 1];
    if (!url || url.startsWith('#')) continue;

    channels.push({
      id: crypto.randomUUID(),
      name: nameMatch?.[1] ?? 'Unknown Channel',
      url: url.trim(),
      logo: tvgLogoMatch?.[1],
      group: groupMatch?.[1],
      tvgId: tvgIdMatch?.[1],
      tvgName: tvgNameMatch?.[1],
    });
    i++;
  }

  return channels;
}

export function generateM3U(channels: Channel[]): string {
  let content = '#EXTM3U\n';
  for (const ch of channels) {
    const attrs: string[] = [];
    if (ch.tvgId) attrs.push(`tvg-id="${ch.tvgId}"`);
    if (ch.tvgName) attrs.push(`tvg-name="${ch.tvgName}"`);
    if (ch.logo) attrs.push(`tvg-logo="${ch.logo}"`);
    if (ch.group) attrs.push(`group-title="${ch.group}"`);
    content += `#EXTINF:-1 ${attrs.join(' ')},${ch.name}\n${ch.url}\n`;
  }
  return content;
}
