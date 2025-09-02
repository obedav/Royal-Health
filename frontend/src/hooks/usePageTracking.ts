// frontend/src/hooks/usePageTracking.ts
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics';

interface PageTrackingOptions {
  trackOnMount?: boolean;
  trackOnLocationChange?: boolean;
  customTitle?: string;
  additionalData?: Record<string, any>;
}

export const usePageTracking = (options: PageTrackingOptions = {}) => {
  const {
    trackOnMount = true,
    trackOnLocationChange = true,
    customTitle,
    additionalData = {},
  } = options;

  const location = useLocation();
  const previousLocation = useRef(location.pathname);

  useEffect(() => {
    if (trackOnMount || (trackOnLocationChange && location.pathname !== previousLocation.current)) {
      const title = customTitle || document.title;
      
      analytics.pageView(location.pathname, title);
      
      // Track additional custom data
      if (Object.keys(additionalData).length > 0) {
        analytics.event('page_data', {
          page_path: location.pathname,
          ...additionalData,
        });
      }

      previousLocation.current = location.pathname;
    }
  }, [location.pathname, trackOnMount, trackOnLocationChange, customTitle, additionalData]);

  return {
    trackPageView: (path?: string, title?: string) => {
      analytics.pageView(path || location.pathname, title || document.title);
    },
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      analytics.event(eventName, {
        page_path: location.pathname,
        ...properties,
      });
    },
  };
};

export default usePageTracking;