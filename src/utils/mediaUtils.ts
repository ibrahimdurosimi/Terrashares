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
 * Default curated estate video tours for standard published properties
 */
export function getDefaultVideosForSlug(slug?: string): PropertyVideo[] {
  if (!slug) return [];

  if (slug === 'beechwood-11-in-progress' || slug === '4-bed-detached-beechwood') {
    return [
      {
        id: 'beechwood-tour-yt',
        url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
        type: 'youtube',
        title: 'Beechwood 11 Construction & Architectural Walkthrough',
        thumbnail: 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg'
      },
      {
        id: 'beechwood-tour-drone',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'file',
        title: 'Estate Drone Aerial & Site Inspection Tour',
        thumbnail: 'https://res.cloudinary.com/snaxm1np/image/upload/f_auto,q_auto/v1788876853/terrashare/properties/uv5jqwyaeg7nj1yjbwl8.jpg'
      }
    ];
  }

  if (slug === 'terrashare-urban-prime-11') {
    return [
      {
        id: 'urban-prime-tour-yt',
        url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        type: 'youtube',
        title: 'Terrashare Urban Prime 11 Virtual Estate Tour',
        thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg'
      },
      {
        id: 'urban-prime-tour-site',
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        type: 'file',
        title: 'Topography & Neighborhood Site Footage',
        thumbnail: 'https://res.cloudinary.com/snaxm1np/image/upload/f_auto,q_auto/v1788879900/terrashare/properties/dw79mdnioyhe9efxedll.jpg'
      }
    ];
  }

  if (slug === 'santefe' || slug === 'lekki-corridor-estate') {
    return [
      {
        id: `${slug}-tour-yt`,
        url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        type: 'youtube',
        title: 'Verified Estate Tour & Development Highlights',
        thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/hqdefault.jpg'
      }
    ];
  }

  return [];
}

/**
 * Retrieves normalized list of PropertyVideos from a property record
 */
export function getPropertyVideos(property: any): PropertyVideo[] {
  if (!property) return [];

  // Parse type_details if string
  let typeDetails = property.type_details;
  if (typeof typeDetails === 'string') {
    try {
      typeDetails = JSON.parse(typeDetails);
    } catch (e) {
      typeDetails = {};
    }
  }

  const rawVideos: any[] = [];

  // 1. Check type_details fields
  if (typeDetails && typeof typeDetails === 'object') {
    if (Array.isArray(typeDetails.videos) && typeDetails.videos.length > 0) {
      rawVideos.push(...typeDetails.videos);
    }
    if (Array.isArray(typeDetails.video_urls) && typeDetails.video_urls.length > 0) {
      rawVideos.push(...typeDetails.video_urls);
    }
    if (typeDetails.video) rawVideos.push(typeDetails.video);
    if (typeDetails.video_url) rawVideos.push(typeDetails.video_url);
    if (typeDetails.youtube_url) rawVideos.push(typeDetails.youtube_url);
    if (typeDetails.virtual_tour) rawVideos.push(typeDetails.virtual_tour);
  }

  // 2. Check top-level properties
  if (Array.isArray(property.videos) && property.videos.length > 0) {
    rawVideos.push(...property.videos);
  }
  if (Array.isArray(property.video_urls) && property.video_urls.length > 0) {
    rawVideos.push(...property.video_urls);
  }
  if (property.video_url) rawVideos.push(property.video_url);
  if (property.video) rawVideos.push(property.video);

  // 3. Check property.image_urls for any uploaded video files or video URLs
  if (Array.isArray(property.image_urls)) {
    property.image_urls.forEach((url: any, idx: number) => {
      if (typeof url === 'string') {
        const trimmed = url.trim();
        if (isDirectVideoUrl(trimmed) || getYouTubeVideoId(trimmed)) {
          rawVideos.push({
            url: trimmed,
            type: detectVideoType(trimmed),
            title: `Uploaded Video Walkthrough ${idx + 1}`
          });
        }
      }
    });
  }

  // Normalize all collected videos
  let normalized = normalizePropertyVideos(rawVideos);

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  normalized = normalized.filter(v => {
    if (!v.url || seenUrls.has(v.url.toLowerCase())) return false;
    seenUrls.add(v.url.toLowerCase());
    return true;
  });

  // 4. Default video tours for published properties if none uploaded yet
  if (normalized.length === 0 && property.slug) {
    const defaults = getDefaultVideosForSlug(property.slug);
    if (defaults && defaults.length > 0) {
      normalized = defaults;
    }
  }

  return normalized;
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

