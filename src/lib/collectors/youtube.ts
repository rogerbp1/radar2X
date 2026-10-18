import { getEnvKey } from '@/lib/config/envKeys';
import { FALLBACK_TRENDS } from '@/lib/mock/fallbackRadarData';
import { EvidenceItem } from '@/types/radar';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

function getFallbackYouTubeEvidence(keyword: string): EvidenceItem[] {
  const match = FALLBACK_TRENDS.find(
    (item) => item.searchKeyword.toLowerCase() === keyword.toLowerCase()
  );
  if (!match) return [];
  return match.evidence.filter((ev) => ev.platform === 'YOUTUBE');
}

/**
 * Busca videos de los últimos 7 días en YouTube Data API v3 y calcula
 * outlierVelocityScore = Math.round(views / Math.max(hoursSincePublished, 1))
 */
export async function searchYouTubeOutliers(
  keyword: string,
  maxResults = 2
): Promise<{ items: EvidenceItem[]; isLive: boolean }> {
  const apiKey = getEnvKey('YOUTUBE_API_KEY');

  if (!apiKey) {
    return {
      items: getFallbackYouTubeEvidence(keyword),
      isLive: false,
    };
  }

  const publishedAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: keyword,
      type: 'video',
      order: 'viewCount',
      publishedAfter,
      maxResults: String(maxResults),
      key: apiKey,
    });

    const searchRes = await fetch(`${YOUTUBE_SEARCH_URL}?${searchParams.toString()}`, {
      signal: controller.signal,
    });

    if (!searchRes.ok) {
      clearTimeout(timeout);
      return { items: getFallbackYouTubeEvidence(keyword), isLive: false };
    }

    const searchData = await searchRes.json();
    const videoIds: string[] = (searchData?.items || [])
      .map((item: { id?: { videoId?: string } }) => item?.id?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      clearTimeout(timeout);
      return { items: getFallbackYouTubeEvidence(keyword), isLive: false };
    }

    const statsParams = new URLSearchParams({
      part: 'statistics,snippet',
      id: videoIds.join(','),
      key: apiKey,
    });

    const statsRes = await fetch(`${YOUTUBE_VIDEOS_URL}?${statsParams.toString()}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!statsRes.ok) {
      return { items: getFallbackYouTubeEvidence(keyword), isLive: false };
    }

    const statsData = await statsRes.json();
    const nowMs = Date.now();

    const liveItems: EvidenceItem[] = (statsData?.items || []).map(
      (video: {
        id: string;
        snippet?: {
          title?: string;
          channelTitle?: string;
          publishedAt?: string;
          description?: string;
        };
        statistics?: { viewCount?: string };
      }) => {
        const publishedAt = video.snippet?.publishedAt || new Date().toISOString();
        const publishedMs = new Date(publishedAt).getTime();
        const hoursSincePublished = Math.max(
          (nowMs - publishedMs) / (1000 * 60 * 60),
          1
        );
        const views = Number(video.statistics?.viewCount || 0);
        const outlierVelocityScore = Math.round(
          views / Math.max(hoursSincePublished, 1)
        );

        return {
          id: `yt-${video.id}`,
          platform: 'YOUTUBE',
          title: video.snippet?.title || `${keyword} - YouTube Trend`,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          author: video.snippet?.channelTitle || 'YouTube Creator',
          publishedAt,
          metrics: {
            viewsOrEngagement: views,
            outlierVelocityScore,
          },
          snippetOrTranscript:
            (video.snippet?.description || '').slice(0, 240) ||
            `Video en tendencia sobre ${keyword} publicado en los últimos 7 días.`,
        };
      }
    );

    return {
      items: liveItems.length > 0 ? liveItems : getFallbackYouTubeEvidence(keyword),
      isLive: liveItems.length > 0,
    };
  } catch {
    clearTimeout(timeout);
    return {
      items: getFallbackYouTubeEvidence(keyword),
      isLive: false,
    };
  }
}
