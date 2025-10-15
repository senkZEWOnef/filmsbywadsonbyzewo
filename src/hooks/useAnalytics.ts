import { useEffect, useCallback } from 'react';
import { AnalyticsRecord } from '@/lib/database';

// Generate a session ID that persists for the browser session
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

type AnalyticsEventType = AnalyticsRecord['event_type'];

interface AnalyticsEvent {
  event_type: AnalyticsEventType;
  page_path: string;
  metadata?: Record<string, string | number | boolean>;
}

export const useAnalytics = () => {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      const sessionId = getSessionId();
      
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      // Silently fail - analytics shouldn't break the user experience
      console.debug('Analytics tracking failed:', error);
    }
  }, []);

  const trackPageView = useCallback((pagePath: string, metadata?: Record<string, string | number | boolean>) => {
    trackEvent({
      event_type: 'page_view',
      page_path: pagePath,
      metadata,
    });
  }, [trackEvent]);

  const trackVideoView = useCallback((videoId: string, videoName: string, pagePath: string) => {
    trackEvent({
      event_type: 'video_view',
      page_path: pagePath,
      metadata: {
        video_id: videoId,
        video_name: videoName,
      },
    });
  }, [trackEvent]);

  const trackPhotoView = useCallback((photoId: string, photoName: string, pagePath: string) => {
    trackEvent({
      event_type: 'photo_view',
      page_path: pagePath,
      metadata: {
        photo_id: photoId,
        photo_name: photoName,
      },
    });
  }, [trackEvent]);

  const trackContactFormView = useCallback((formType: string, pagePath: string) => {
    trackEvent({
      event_type: 'contact_form_view',
      page_path: pagePath,
      metadata: {
        form_type: formType,
      },
    });
  }, [trackEvent]);

  const trackBookingFormView = useCallback((pagePath: string) => {
    trackEvent({
      event_type: 'booking_form_view',
      page_path: pagePath,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackVideoView,
    trackPhotoView,
    trackContactFormView,
    trackBookingFormView,
  };
};

// Hook for automatic page view tracking
export const usePageViewTracking = (pagePath: string, metadata?: Record<string, string | number | boolean>) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Small delay to ensure page is fully loaded
    const timer = setTimeout(() => {
      trackPageView(pagePath, metadata);
    }, 100);

    return () => clearTimeout(timer);
  }, [pagePath, trackPageView, metadata]);
};

// Hook for fetching analytics data (admin use)
export const useAnalyticsData = () => {
  const fetchSummary = useCallback(async (days: number = 30) => {
    try {
      const response = await fetch(`/api/analytics/summary?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch analytics summary:', error);
      throw error;
    }
  }, []);

  const fetchEvents = useCallback(async (filters: {
    event_type?: string;
    page_path?: string;
    days?: number;
  } = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.event_type) params.append('event_type', filters.event_type);
      if (filters.page_path) params.append('page_path', filters.page_path);
      if (filters.days) params.append('days', filters.days.toString());

      const response = await fetch(`/api/analytics?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch analytics events:', error);
      throw error;
    }
  }, []);

  return {
    fetchSummary,
    fetchEvents,
  };
};