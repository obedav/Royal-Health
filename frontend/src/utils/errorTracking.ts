// frontend/src/utils/errorTracking.ts
interface ErrorInfo {
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId: string;
  buildVersion?: string;
  environment: string;
  extra?: Record<string, any>;
}

interface ErrorTrackingConfig {
  apiEndpoint?: string;
  apiKey?: string;
  sentryDsn?: string;
  bugsnagApiKey?: string;
  maxErrors?: number;
  enableConsoleCapture?: boolean;
  enableUnhandledRejection?: boolean;
  enableResourceErrors?: boolean;
  beforeSend?: (errorInfo: ErrorInfo) => ErrorInfo | null;
  onError?: (errorInfo: ErrorInfo) => void;
}

class ErrorTracking {
  private config: Required<Omit<ErrorTrackingConfig, 'sentryDsn' | 'bugsnagApiKey' | 'beforeSend' | 'onError'>> & 
    Pick<ErrorTrackingConfig, 'sentryDsn' | 'bugsnagApiKey' | 'beforeSend' | 'onError'>;
  private errorCount = 0;
  private sessionId: string;
  private isInitialized = false;

  constructor(config: ErrorTrackingConfig = {}) {
    this.sessionId = this.generateSessionId();
    this.config = {
      apiEndpoint: '/api/v1/errors', // Note: endpoint not implemented yet
      apiKey: '',
      maxErrors: 10,
      enableConsoleCapture: true,
      enableUnhandledRejection: true,
      enableResourceErrors: true,
      ...config,
    };
  }

  /**
   * Initialize error tracking
   */
  init() {
    if (this.isInitialized) return;

    this.setupGlobalHandlers();
    this.setupConsoleCapture();
    this.initExternalServices();

    this.isInitialized = true;
    console.log('🔍 Error tracking initialized');
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        environment: process.env.NODE_ENV || 'development',
      });
    });

    // Unhandled promise rejections
    if (this.config.enableUnhandledRejection) {
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError({
          message: `Unhandled Promise Rejection: ${event.reason}`,
          stack: event.reason?.stack,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          sessionId: this.sessionId,
          environment: process.env.NODE_ENV || 'development',
          extra: { type: 'unhandledrejection', reason: event.reason },
        });
      });
    }

    // Resource loading errors
    if (this.config.enableResourceErrors) {
      window.addEventListener('error', (event) => {
        const target = event.target as HTMLElement;
        if (target !== window && target?.tagName) {
          this.captureError({
            message: `Resource loading error: ${target.tagName}`,
            url: (target as any).src || (target as any).href || window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            sessionId: this.sessionId,
            environment: process.env.NODE_ENV || 'development',
            extra: {
              type: 'resource_error',
              tagName: target.tagName,
              src: (target as any).src,
              href: (target as any).href,
            },
          });
        }
      }, true);
    }
  }

  /**
   * Setup console error capture
   */
  private setupConsoleCapture() {
    if (!this.config.enableConsoleCapture) return;

    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Call original console.error
      originalError.apply(console, args);

      // Capture the error
      const message = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ');

      this.captureError({
        message: `Console Error: ${message}`,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        environment: process.env.NODE_ENV || 'development',
        extra: { type: 'console_error', args },
      });
    };
  }

  /**
   * Initialize external error tracking services
   */
  private async initExternalServices() {
    // Initialize Sentry
    if (this.config.sentryDsn) {
      try {
        // Dynamic import to avoid loading Sentry if not needed
        const Sentry = await import('@sentry/browser');
        Sentry.init({
          dsn: this.config.sentryDsn,
          environment: process.env.NODE_ENV || 'development',
          beforeSend(event) {
            return process.env.NODE_ENV === 'production' ? event : null;
          },
        });
        console.log('🔍 Sentry initialized');
      } catch (error) {
        console.warn('Failed to initialize Sentry:', error);
      }
    }

    // Initialize Bugsnag
    if (this.config.bugsnagApiKey) {
      try {
        const Bugsnag = await import('@bugsnag/js');
        Bugsnag.start({
          apiKey: this.config.bugsnagApiKey,
          enabledReleaseStages: ['production', 'staging'],
        });
        console.log('🔍 Bugsnag initialized');
      } catch (error) {
        console.warn('Failed to initialize Bugsnag:', error);
      }
    }
  }

  /**
   * Capture and report an error
   */
  captureError(errorInfo: Partial<ErrorInfo>) {
    if (this.errorCount >= this.config.maxErrors) {
      return; // Prevent spam
    }

    const completeErrorInfo: ErrorInfo = {
      message: 'Unknown error',
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      environment: process.env.NODE_ENV || 'development',
      buildVersion: process.env.VITE_APP_VERSION,
      ...errorInfo,
    };

    // Apply beforeSend filter
    const processedError = this.config.beforeSend 
      ? this.config.beforeSend(completeErrorInfo)
      : completeErrorInfo;

    if (!processedError) return; // Error was filtered out

    this.errorCount++;

    // Call onError callback
    if (this.config.onError) {
      this.config.onError(processedError);
    }

    // Send to backend
    this.sendToBackend(processedError);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔍 Error captured:', processedError);
    }
  }

  /**
   * Send error to backend
   */
  private async sendToBackend(errorInfo: ErrorInfo) {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify(errorInfo),
      });

      if (!response.ok) {
        // Don't throw for 404 since error endpoint may not be implemented yet
        if (response.status === 404) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Error logging endpoint not available (404) - errors will only be logged locally');
          }
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      // Silently fail to avoid infinite loops
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to send error to backend:', error);
      }
    }
  }

  /**
   * Manually capture an exception
   */
  captureException(error: Error, extra?: Record<string, any>) {
    this.captureError({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      environment: process.env.NODE_ENV || 'development',
      extra,
    });
  }

  /**
   * Set user context
   */
  setUser(userId: string, email?: string, extra?: Record<string, any>) {
    // Store user info for future errors
    (this as any).userId = userId;
    (this as any).userEmail = email;
    (this as any).userExtra = extra;
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, category = 'default', data?: Record<string, any>) {
    // Simple breadcrumb storage (implement as needed)
    const breadcrumb = {
      message,
      category,
      data,
      timestamp: Date.now(),
    };

    // Store in session storage for debugging
    try {
      const breadcrumbs = JSON.parse(sessionStorage.getItem('error_breadcrumbs') || '[]');
      breadcrumbs.push(breadcrumb);
      
      // Keep only last 10 breadcrumbs
      if (breadcrumbs.length > 10) {
        breadcrumbs.shift();
      }
      
      sessionStorage.setItem('error_breadcrumbs', JSON.stringify(breadcrumbs));
    } catch (error) {
      // Ignore storage errors
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Check if error tracking is enabled for current environment
   */
  get isEnabled(): boolean {
    return this.isInitialized && (
      process.env.NODE_ENV === 'production' || 
      process.env.NODE_ENV === 'staging' ||
      process.env.VITE_ENABLE_ERROR_TRACKING === 'true'
    );
  }
}

// Default instance
export const errorTracking = new ErrorTracking();

// React Error Boundary integration
export const captureReactError = (error: Error, errorInfo: React.ErrorInfo) => {
  errorTracking.captureError({
    message: `React Error: ${error.message}`,
    stack: error.stack,
    extra: {
      type: 'react_error',
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    },
  });
};

// Hook for React components
export const useErrorTracking = () => {
  return {
    captureError: (error: Error, extra?: Record<string, any>) => {
      errorTracking.captureException(error, extra);
    },
    addBreadcrumb: (message: string, category?: string, data?: Record<string, any>) => {
      errorTracking.addBreadcrumb(message, category, data);
    },
    setUser: (userId: string, email?: string, extra?: Record<string, any>) => {
      errorTracking.setUser(userId, email, extra);
    },
  };
};

export default ErrorTracking;