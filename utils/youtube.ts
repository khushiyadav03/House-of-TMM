/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
    /youtube\.com\/embed\/([^"&?\/\s]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Generate YouTube thumbnail URL from video URL
 * Returns high quality thumbnail (hqdefault) by default
 */
export function getYouTubeThumbnail(videoUrl: string, quality: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'): string | null {
  const videoId = extractYouTubeVideoId(videoUrl);
  
  if (!videoId) return null;
  
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Convert any YouTube URL to embed format
 */
export function getYouTubeEmbedUrl(url: string): string {
  if (url.includes('embed')) {
    return url;
  }
  
  const videoId = extractYouTubeVideoId(url);
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url; // Return original if no match found
}

/**
 * Validate if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}