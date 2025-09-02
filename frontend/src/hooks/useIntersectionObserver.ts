// frontend/src/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

interface UseIntersectionObserverResult {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLElement>, UseIntersectionObserverResult] => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    enabled = true,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    observerRef.current = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        setIsIntersecting(observerEntry.isIntersecting);

        // If triggerOnce is true and element is intersecting, disconnect observer
        if (triggerOnce && observerEntry.isIntersecting && observerRef.current) {
          observerRef.current.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, enabled]);

  return [elementRef, { isIntersecting, entry }];
};

// Hook for triggering animations when element enters viewport
export const useInViewAnimation = (options: UseIntersectionObserverOptions = {}) => {
  const [ref, { isIntersecting }] = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
    ...options,
  });

  return [ref, isIntersecting] as const;
};

// Hook for lazy loading content
export const useLazyLoad = (options: UseIntersectionObserverOptions = {}) => {
  const [ref, { isIntersecting }] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
    ...options,
  });

  return [ref, isIntersecting] as const;
};

// Hook for infinite scrolling
export const useInfiniteScroll = (
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) => {
  const [ref, { isIntersecting }] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    ...options,
  });

  useEffect(() => {
    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting, callback]);

  return ref;
};

// Hook for tracking element visibility for analytics
export const useViewTracking = (
  trackingId: string,
  onView?: (id: string) => void,
  options: UseIntersectionObserverOptions = {}
) => {
  const [ref, { isIntersecting }] = useIntersectionObserver({
    threshold: 0.5, // Element needs to be 50% visible
    triggerOnce: true,
    ...options,
  });

  useEffect(() => {
    if (isIntersecting && onView) {
      onView(trackingId);
    }
  }, [isIntersecting, trackingId, onView]);

  return ref;
};

export default useIntersectionObserver;