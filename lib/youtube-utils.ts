/**
 * Utility functions for YouTube video handling
 */

/**
 * Converts various YouTube URL formats to embed format
 * @param url - YouTube URL in any format
 * @returns Embed URL or null if invalid
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  // If already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  // Extract video ID from various YouTube URL formats
  const videoIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(videoIdRegex);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return null;
}

/**
 * Extracts video ID from YouTube URL
 * @param url - YouTube URL
 * @returns Video ID or null if invalid
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const videoIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(videoIdRegex);
  
  return match ? match[1] : null;
}

/**
 * Generates thumbnail URL from video ID
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns Thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: string = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}