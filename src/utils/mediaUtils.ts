import { PropertyVideo } from '../types/media';

/**
 * Extracts a YouTube Video ID from various YouTube URL formats
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. Shorts
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/)([\w-]{11})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // 2. youtu.be/<id>
  const youtuBeMatch = trimmed.match(/(?:youtu\.be\/)([\w-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];

  // 3. youtube.com/embed/<id>
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([\w-]{11})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // 4. youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/[?&]v=([\w-]{11})/i);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // 5. Standard 11 char ID directly
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  return null;
}

/**
 * Generates an embedded YouTube URL with safe parameters
 */
export function getYouTubeEmbedUrl(urlOrId: string, autoplay: boolean = false): string {
  const videoId = getYouTubeVideoId(urlOrId) || urlOrId;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (autoplay) {
    params.set('autoplay', '1');
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generates high quality YouTube thumbnail URL
 */
export function getYouTubeThumbnail(urlOrId: string): string {
  const videoId = getYouTubeVideoId(urlOrId);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
}

/**
 * Detects whether a URL is a YouTube link or a direct raw video file
 */
export function detectVideoType(url: string): 'youtube' | 'file' {
  if (getYouTubeVideoId(url)) {
    return 'youtube';
  }
  return 'file';
}

/**
 * Checks if a URL points directly to a video file format
 */
export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.ogg') ||
    url.includes('/video/upload/') // Cloudinary video pattern
  );
}

/**
 * Retrieves normalized list of PropertyVideos from a property record
 */
export function getPropertyVideos(property: any): PropertyVideo[] {
  if (!property) return [];

  // Check type_details.videos
  const typeDetails = property.type_details;
  let rawVideos: any[] = [];

  if (typeDetails && typeof typeDetails === 'object') {
    if (Array.isArray(typeDetails.videos)) {
      rawVideos = typeDetails.videos;
    } else if (Array.isArray(typeDetails.video_urls)) {
      rawVideos = typeDetails.video_urls;
    }
  }

  // Also check top-level property.video_urls if ever populated
  if (rawVideos.length === 0 && Array.isArray(property.video_urls)) {
    rawVideos = property.video_urls;
  }

  return normalizePropertyVideos(rawVideos);
}

/**
 * Normalizes an array of video entries (which could be strings or objects)
 */
export function normalizePropertyVideos(rawVideos: any[]): PropertyVideo[] {
  if (!Array.isArray(rawVideos)) return [];

  return rawVideos
    .filter(item => Boolean(item))
    .map((item, index) => {
      if (typeof item === 'string') {
        const type = detectVideoType(item);
        const youtubeId = type === 'youtube' ? getYouTubeVideoId(item) : null;
        return {
          id: `video-${index}-${Date.now()}`,
          url: item.trim(),
          type,
          title: type === 'youtube' ? 'YouTube Video Tour' : `Video Asset ${index + 1}`,
          thumbnail: youtubeId ? getYouTubeThumbnail(youtubeId) : undefined,
        };
      }

      const url = (item.url || '').trim();
      const type = item.type || detectVideoType(url);
      const youtubeId = type === 'youtube' ? getYouTubeVideoId(url) : null;

      return {
        id: item.id || `video-${index}-${Date.now()}`,
        url,
        type,
        title: item.title || (type === 'youtube' ? 'YouTube Video Tour' : `Video Asset ${index + 1}`),
        thumbnail: item.thumbnail || (youtubeId ? getYouTubeThumbnail(youtubeId) : undefined),
      };
    })
    .filter(v => Boolean(v.url));
}
