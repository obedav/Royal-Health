// frontend/src/hooks/useKeyboardNavigation.ts
import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  selector?: string;
  loop?: boolean;
  autoFocus?: boolean;
  onEscape?: () => void;
  onEnter?: (element: Element) => void;
  onArrowKey?: (direction: 'up' | 'down' | 'left' | 'right', element: Element) => void;
}

export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    selector = '[data-keyboard-nav], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    loop = true,
    autoFocus = false,
    onEscape,
    onEnter,
    onArrowKey,
  } = options;

  const currentIndex = useRef(-1);

  const getNavigableElements = useCallback((): Element[] => {
    if (!containerRef.current) return [];
    
    const elements = Array.from(
      containerRef.current.querySelectorAll(selector)
    ).filter((el) => {
      const element = el as HTMLElement;
      return (
        !element.disabled &&
        element.offsetParent !== null && // Element is visible
        !element.getAttribute('aria-hidden')
      );
    });
    
    return elements;
  }, [containerRef, selector]);

  const focusElement = useCallback((index: number) => {
    const elements = getNavigableElements();
    if (elements.length === 0) return;

    let targetIndex = index;
    
    if (loop) {
      if (targetIndex < 0) {
        targetIndex = elements.length - 1;
      } else if (targetIndex >= elements.length) {
        targetIndex = 0;
      }
    } else {
      targetIndex = Math.max(0, Math.min(targetIndex, elements.length - 1));
    }

    const element = elements[targetIndex] as HTMLElement;
    if (element) {
      element.focus();
      currentIndex.current = targetIndex;
    }
  }, [getNavigableElements, loop]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const elements = getNavigableElements();
    if (elements.length === 0) return;

    // Find current focused element index
    const activeElement = document.activeElement;
    const activeIndex = elements.findIndex(el => el === activeElement);
    
    if (activeIndex !== -1) {
      currentIndex.current = activeIndex;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusElement(currentIndex.current + 1);
        if (onArrowKey) onArrowKey('down', elements[currentIndex.current]);
        break;

      case 'ArrowUp':
        event.preventDefault();
        focusElement(currentIndex.current - 1);
        if (onArrowKey) onArrowKey('up', elements[currentIndex.current]);
        break;

      case 'ArrowLeft':
        event.preventDefault();
        focusElement(currentIndex.current - 1);
        if (onArrowKey) onArrowKey('left', elements[currentIndex.current]);
        break;

      case 'ArrowRight':
        event.preventDefault();
        focusElement(currentIndex.current + 1);
        if (onArrowKey) onArrowKey('right', elements[currentIndex.current]);
        break;

      case 'Home':
        event.preventDefault();
        focusElement(0);
        break;

      case 'End':
        event.preventDefault();
        focusElement(elements.length - 1);
        break;

      case 'Enter':
      case ' ':
        if (activeElement && onEnter) {
          event.preventDefault();
          onEnter(activeElement);
        }
        break;

      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
    }
  }, [getNavigableElements, focusElement, onArrowKey, onEnter, onEscape]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);

    // Auto focus first element if enabled
    if (autoFocus) {
      const elements = getNavigableElements();
      if (elements.length > 0) {
        (elements[0] as HTMLElement).focus();
        currentIndex.current = 0;
      }
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, handleKeyDown, autoFocus, getNavigableElements]);

  return {
    focusElement,
    currentIndex: currentIndex.current,
    getNavigableElements,
  };
};

// Hook for modal/dialog keyboard navigation
export const useModalKeyboardNavigation = (
  isOpen: boolean,
  onClose: () => void,
  containerRef: React.RefObject<HTMLElement>
) => {
  const navigation = useKeyboardNavigation(containerRef, {
    loop: true,
    autoFocus: isOpen,
    onEscape: onClose,
  });

  // Focus trap for modals
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = navigation.getNavigableElements();
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element when modal opens
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, containerRef, navigation]);

  return navigation;
};

// Hook for dropdown/menu keyboard navigation
export const useMenuKeyboardNavigation = (
  isOpen: boolean,
  onClose: () => void,
  containerRef: React.RefObject<HTMLElement>
) => {
  return useKeyboardNavigation(containerRef, {
    selector: '[role="menuitem"], button',
    loop: true,
    autoFocus: isOpen,
    onEscape: onClose,
    onEnter: (element) => {
      (element as HTMLElement).click();
    },
  });
};

// Hook for list keyboard navigation (like search results)
export const useListKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  onSelect?: (element: Element) => void
) => {
  return useKeyboardNavigation(containerRef, {
    selector: '[data-list-item], [role="option"]',
    loop: false,
    onEnter: onSelect,
  });
};

export default useKeyboardNavigation;