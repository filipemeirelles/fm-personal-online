export type VideoEmbed =
  | { type: "youtube"; src: string }
  | { type: "vimeo"; src: string }
  | { type: "mp4"; src: string }
  | { type: "link"; href: string };

export function resolveVideoEmbed(url: string | null): VideoEmbed | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeId = parseYouTube(trimmed);
  if (youtubeId) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${youtubeId}`,
    };
  }

  const vimeoId = parseVimeo(trimmed);
  if (vimeoId) {
    return { type: "vimeo", src: `https://player.vimeo.com/video/${vimeoId}` };
  }

  if (isMp4Url(trimmed)) {
    return { type: "mp4", src: trimmed };
  }

  return { type: "link", href: trimmed };
}

function parseYouTube(url: string): string | null {
  const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
  if (shortMatch) return shortMatch[1];

  const embedMatch = url.match(/youtube\.com\/embed\/([\w-]+)/);
  if (embedMatch) return embedMatch[1];

  return null;
}

function parseVimeo(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function isMp4Url(url: string): boolean {
  try {
    const { pathname } = new URL(url);
    return pathname.toLowerCase().endsWith(".mp4");
  } catch {
    return false;
  }
}
