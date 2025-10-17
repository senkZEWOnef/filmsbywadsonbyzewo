// Utility functions for YouTube video handling

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }
  
  return null;
}

export function getYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}