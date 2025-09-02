// frontend/src/utils/analytics.ts
interface AnalyticsConfig {
  gtmId?: string;
  gaId?: string;
  hotjarId?: string;
  clarityId?: string;
  debug?: boolean;
}

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

interface UserProperties {
  userId?: string;
  role?: string;
  plan?: string;
  [key: string]: string | number | boolean | undefined;
}

class Analytics {
  private config: AnalyticsConfig;
  private isInitialized = false;

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      debug: process.env.NODE_ENV === 'development',
      ...config,
    };
  }

  /**
   * Initialize analytics services
   */
  async init(config?: Partial<AnalyticsConfig>) {
    if (this.isInitialized) return;

    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Don't load analytics in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !this.config.debug) {
      console.log('📊 Analytics disabled in development mode');
      return;
    }

    try {
      await Promise.all([
        this.initGoogleAnalytics(),
        this.initGoogleTagManager(),
        this.initHotjar(),
        this.initMicrosoftClarity(),
      ]);

      this.isInitialized = true;
      console.log('📊 Analytics initialized successfully');
    } catch (error) {
      console.error('📊 Analytics initialization failed:', error);
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  private async initGoogleAnalytics() {
    if (!this.config.gaId) return;

    return new Promise<void>((resolve) => {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
      document.head.appendChild(script);

      script.onload = () => {
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };

        window.gtag('js', new Date());
        window.gtag('config', this.config.gaId!, {
          page_title: document.title,
          page_location: window.location.href,
        });

        if (this.config.debug) {
          console.log('📊 Google Analytics initialized');
        }
        resolve();
      };
    });
  }

  /**
   * Initialize Google Tag Manager
   */
  private async initGoogleTagManager() {
    if (!this.config.gtmId) return;

    return new Promise<void>((resolve) => {
      // GTM script
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${this.config.gtmId}');
      `;
      document.head.appendChild(script);

      // GTM noscript
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${this.config.gtmId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.appendChild(noscript);

      if (this.config.debug) {
        console.log('📊 Google Tag Manager initialized');
      }
      resolve();
    });
  }

  /**
   * Initialize Hotjar
   */
  private async initHotjar() {
    if (!this.config.hotjarId) return;

    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${this.config.hotjarId},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
      document.head.appendChild(script);

      if (this.config.debug) {
        console.log('📊 Hotjar initialized');
      }
      resolve();
    });
  }

  /**
   * Initialize Microsoft Clarity
   */
  private async initMicrosoftClarity() {
    if (!this.config.clarityId) return;

    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${this.config.clarityId}");
      `;
      document.head.appendChild(script);

      if (this.config.debug) {
        console.log('📊 Microsoft Clarity initialized');
      }
      resolve();
    });
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string) {
    if (!this.isInitialized && !this.config.debug) return;

    const data = {
      page_title: title || document.title,
      page_location: window.location.origin + path,
      page_path: path,
    };

    if (window.gtag) {
      window.gtag('config', this.config.gaId!, data);
    }

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        ...data,
      });
    }

    if (this.config.debug) {
      console.log('📊 Page view:', data);
    }
  }

  /**
   * Track custom event
   */
  event(eventName: string, properties: EventProperties = {}) {
    if (!this.isInitialized && !this.config.debug) return;

    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }

    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...properties,
      });
    }

    if (this.config.debug) {
      console.log('📊 Event:', eventName, properties);
    }
  }

  /**
   * Identify user
   */
  identify(userId: string, properties: UserProperties = {}) {
    if (!this.isInitialized && !this.config.debug) return;

    if (window.gtag) {
      window.gtag('config', this.config.gaId!, {
        user_id: userId,
        custom_map: properties,
      });
    }

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'user_identify',
        user_id: userId,
        user_properties: properties,
      });
    }

    if (this.config.debug) {
      console.log('📊 User identified:', userId, properties);
    }
  }

  /**
   * Track user engagement
   */
  engagement(action: string, properties: EventProperties = {}) {
    this.event('engagement', {
      engagement_action: action,
      ...properties,
    });
  }

  /**
   * Track business events
   */
  business = {
    bookingStarted: (serviceType: string) => {
      this.event('booking_started', {
        service_type: serviceType,
        value: 5000,
        currency: 'NGN',
      });
    },

    bookingCompleted: (bookingId: string, serviceType: string) => {
      this.event('purchase', {
        transaction_id: bookingId,
        service_type: serviceType,
        value: 5000,
        currency: 'NGN',
      });
    },

    signUp: (method: string) => {
      this.event('sign_up', {
        method: method,
      });
    },

    login: (method: string) => {
      this.event('login', {
        method: method,
      });
    },

    contactFormSubmit: (inquiryType: string) => {
      this.event('generate_lead', {
        inquiry_type: inquiryType,
      });
    },
  };
}

// Default instance
export const analytics = new Analytics();

// Export for custom configuration
export default Analytics;

// Type declarations for global objects
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    hj: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}