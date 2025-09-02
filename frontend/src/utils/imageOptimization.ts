
// frontend/src/utils/imageOptimization.ts

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  blur?: number;
}

export interface ResponsiveImageConfig {
  breakpoints: number[];
  sizes: string;
  formats?: string[];
}

class ImageOptimization {
  private baseUrl: string;
  private defaultQuality: number;

  constructor(baseUrl: string = '', defaultQuality: number = 75) {
    this.baseUrl = baseUrl;
    this.defaultQuality = defaultQuality;
  }

  /**
   * Generate optimized image URL
   */
  getOptimizedUrl(src: string, options: ImageOptions = {}): string {
    // For local development or external URLs, return as-is
    if (!this.baseUrl || src.startsWith('http') || src.startsWith('data:')) {
      return src;
    }

    const {
      width,
      height,
      quality = this.defaultQuality,
      format = 'webp',
      fit = 'cover',
      blur,
    } = options;

    const params = new URLSearchParams();

    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== this.defaultQuality) params.append('q', quality.toString());
    if (format !== 'webp') params.append('f', format);
    if (fit !== 'cover') params.append('fit', fit);
    if (blur) params.append('blur', blur.toString());

    const queryString = params.toString();
    const separator = src.includes('?') ? '&' : '?';

    return queryString ? `${this.baseUrl}${src}${separator}${queryString}` : `${this.baseUrl}${src}`;
  }

  /**
   * Generate srcSet for responsive images
   */
  generateSrcSet(src: string, config: ResponsiveImageConfig, options: ImageOptions = {}): string {
    const { breakpoints, formats = ['webp', 'jpeg'] } = config;

    const srcSetEntries = breakpoints.map(width => {
      const optimizedUrl = this.getOptimizedUrl(src, { ...options, width });
      return `${optimizedUrl} ${width}w`;
    });

    return srcSetEntries.join(', ');
  }

  /**
   * Generate responsive image configuration
   */
  getResponsiveConfig(src: string, config: ResponsiveImageConfig, options: ImageOptions = {}) {
    const { sizes, formats = ['webp', 'jpeg'] } = config;

    return {
      src: this.getOptimizedUrl(src, options),
      srcSet: this.generateSrcSet(src, config, options),
      sizes,
      // Generate sources for different formats
      sources: formats.map(format => ({
        type: `image/${format}`,
        srcSet: this.generateSrcSet(src, config, { ...options, format: format as any }),
        sizes,
      })),
    };
  }

  /**
   * Preload critical images
   */
  preloadImage(src: string, options: ImageOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
      
      img.src = this.getOptimizedUrl(src, options);
    });
  }

  /**
   * Preload multiple images
   */
  async preloadImages(
    images: Array<{ src: string; options?: ImageOptions }>
  ): Promise<void[]> {
    const promises = images.map(({ src, options }) => 
      this.preloadImage(src, options)
    );
    
    return Promise.all(promises);
  }

  /**
   * Generate blur placeholder data URL
   */
  generateBlurPlaceholder(src: string, size: number = 10): string {
    // For now, return a simple data URL
    // In production, you might want to generate actual blur placeholders
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = size;
    canvas.height = size;
    
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, size, size);
    }
    
    return canvas.toDataURL();
  }

  /**
   * Check if WebP is supported
   */
  static isWebPSupported(): Promise<boolean> {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Check if AVIF is supported
   */
  static isAVIFSupported(): Promise<boolean> {
    return new Promise(resolve => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
    });
  }
}

// Default instance
export const imageOptimizer = new ImageOptimization();

// Responsive breakpoints configuration
export const defaultBreakpoints = [320, 640, 768, 1024, 1280, 1536];

// Common responsive configurations
export const responsiveConfigs = {
  hero: {
    breakpoints: [640, 768, 1024, 1280, 1920],
    sizes: '100vw',
    formats: ['webp', 'jpeg'],
  },
  card: {
    breakpoints: [300, 400, 500, 600],
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    formats: ['webp', 'jpeg'],
  },
  avatar: {
    breakpoints: [40, 60, 80, 100, 120],
    sizes: '(max-width: 768px) 60px, 80px',
    formats: ['webp', 'jpeg'],
  },
  thumbnail: {
    breakpoints: [100, 150, 200, 250],
    sizes: '150px',
    formats: ['webp', 'jpeg'],
  },
} satisfies Record<string, ResponsiveImageConfig>;

// Utility functions
export const getOptimizedImageUrl = (src: string, options: ImageOptions = {}) =>
  imageOptimizer.getOptimizedUrl(src, options);

export const getResponsiveImageProps = (
  src: string,
  configKey: keyof typeof responsiveConfigs,
  options: ImageOptions = {}
) => {
  const config = responsiveConfigs[configKey];
  return imageOptimizer.getResponsiveConfig(src, config, options);
};

export const preloadCriticalImages = async (images: string[]) => {
  const imageConfigs = images.map(src => ({ src, options: { quality: 90 } }));
  await imageOptimizer.preloadImages(imageConfigs);
};

export default ImageOptimization;