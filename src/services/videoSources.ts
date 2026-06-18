/**
 * Self-hosted video URL mapping
 *
 * TMDB returns movie metadata only — it does NOT provide streaming URLs.
 * You must host your own video files (e.g. on a CDN, S3, your own server)
 * and map them here by movie ID.
 *
 * Example video sources you can use for testing:
 *  - https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8 (HLS)
 *  - https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4 (MP4)
 *  - https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8
 */

import {Movie} from '../types/movie';

// === SAMPLE STREAMING URLS (replace with your own) ===
const SAMPLE_STREAMS: Record<number, string> = {
  // Example: TMDB movie ID 27205 = Inception (2010)
  // 27205: 'https://your-cdn.com/inception.m3u8',

  // Default fallback (used for any movie without a custom URL)
  _default: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
};

/**
 * Returns a streaming URL for a given movie.
 * Falls back to a sample HLS stream if no custom URL is configured.
 */
export const getStreamUrl = (movie: Movie): string => {
  // Use movie.video_url if explicitly set
  if (movie.video_url) {
    return movie.video_url;
  }

  // Look up by TMDB movie ID
  if (SAMPLE_STREAMS[movie.id]) {
    return SAMPLE_STREAMS[movie.id];
  }

  // Fall back to sample stream so the app always has something to play
  return SAMPLE_STREAMS._default;
};

/**
 * Add or update a custom streaming URL for a movie
 */
export const setStreamUrl = (movieId: number, url: string): void => {
  SAMPLE_STREAMS[movieId] = url;
};

export default {
  getStreamUrl,
  setStreamUrl,
};
