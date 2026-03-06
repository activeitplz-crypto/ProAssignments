import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;

    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.startsWith('/shorts/')) {
        videoId = urlObj.pathname.substring('/shorts/'.length);
      } else if (urlObj.pathname.startsWith('/live/')) {
        videoId = urlObj.pathname.substring('/live/'.length);
      } else {
        videoId = urlObj.searchParams.get('v');
      }
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    }
    
    // Clean up potential query parameters from the videoId
    if (videoId) {
        const queryIndex = videoId.indexOf('?');
        if (queryIndex !== -1) {
            videoId = videoId.substring(0, queryIndex);
        }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (error) {
    return null;
  }
}
