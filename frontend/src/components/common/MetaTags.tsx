// frontend/src/components/common/MetaTags.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string;
  viewport?: string;
  charset?: string;
  language?: string;
  author?: string;
  generator?: string;
  applicationName?: string;
  referrer?: string;
  themeColor?: string;
  colorScheme?: 'light' | 'dark' | 'light dark';
  preconnect?: string[];
  prefetch?: string[];
  preload?: Array<{
    href: string;
    as: string;
    type?: string;
    crossorigin?: boolean;
  }>;
  customMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
    httpEquiv?: string;
  }>;
  customLinks?: Array<{
    rel: string;
    href: string;
    type?: string;
    media?: string;
    sizes?: string;
  }>;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  robots = 'index, follow',
  viewport = 'width=device-width, initial-scale=1.0, viewport-fit=cover',
  charset = 'utf-8',
  language = 'en',
  author = 'Royal Health Consult',
  generator = 'Vite + React',
  applicationName = 'Royal Health Consult',
  referrer = 'strict-origin-when-cross-origin',
  themeColor = '#4F46E5',
  colorScheme = 'light dark',
  preconnect = [],
  prefetch = [],
  preload = [],
  customMeta = [],
  customLinks = [],
}) => {
  return (
    <Helmet>
      {/* Character Encoding */}
      <meta charSet={charset} />
      
      {/* Viewport */}
      <meta name="viewport" content={viewport} />
      
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Language and Direction */}
      <html lang={language} />
      <meta httpEquiv="content-language" content={language} />
      
      {/* Search Engine Directives */}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="bingbot" content={robots} />
      
      {/* Author and Generator */}
      <meta name="author" content={author} />
      <meta name="generator" content={generator} />
      <meta name="application-name" content={applicationName} />
      
      {/* Security and Privacy */}
      <meta name="referrer" content={referrer} />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Theme and Color Scheme */}
      <meta name="theme-color" content={themeColor} />
      <meta name="color-scheme" content={colorScheme} />
      <meta name="msapplication-TileColor" content={themeColor} />
      <meta name="msapplication-navbutton-color" content={themeColor} />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Mobile and PWA */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={applicationName} />
      <meta name="apple-touch-fullscreen" content="yes" />
      
      {/* Format Detection */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="address=no" />
      <meta name="format-detection" content="email=no" />
      
      {/* Cache Control */}
      <meta httpEquiv="cache-control" content="no-cache, no-store, must-revalidate" />
      <meta httpEquiv="pragma" content="no-cache" />
      <meta httpEquiv="expires" content="0" />
      
      {/* Preconnect Links */}
      {preconnect.map((url, index) => (
        <link key={`preconnect-${index}`} rel="preconnect" href={url} />
      ))}
      
      {/* DNS Prefetch */}
      {prefetch.map((url, index) => (
        <link key={`prefetch-${index}`} rel="dns-prefetch" href={url} />
      ))}
      
      {/* Preload Links */}
      {preload.map((resource, index) => (
        <link
          key={`preload-${index}`}
          rel="preload"
          href={resource.href}
          as={resource.as}
          type={resource.type}
          crossOrigin={resource.crossorigin ? 'anonymous' : undefined}
        />
      ))}
      
      {/* Custom Meta Tags */}
      {customMeta.map((meta, index) => {
        if (meta.httpEquiv) {
          return (
            <meta
              key={`custom-meta-${index}`}
              httpEquiv={meta.httpEquiv}
              content={meta.content}
            />
          );
        }
        return (
          <meta
            key={`custom-meta-${index}`}
            name={meta.name}
            property={meta.property}
            content={meta.content}
          />
        );
      })}
      
      {/* Custom Links */}
      {customLinks.map((link, index) => (
        <link
          key={`custom-link-${index}`}
          rel={link.rel}
          href={link.href}
          type={link.type}
          media={link.media}
          sizes={link.sizes}
        />
      ))}
      
      {/* Favicon Links */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color={themeColor} />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
    </Helmet>
  );
};

// Performance-focused meta tags preset
export const PerformanceMetaTags: React.FC = () => (
  <MetaTags
    preconnect={[
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.royalhealthconsult.com',
    ]}
    prefetch={[
      'https://fonts.googleapis.com',
      'https://cdnjs.cloudflare.com',
    ]}
    preload={[
      {
        href: '/logo-img.jpg',
        as: 'image',
        type: 'image/jpeg',
      },
      {
        href: '/fonts/inter-var.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true,
      },
    ]}
  />
);

// Security-focused meta tags preset
export const SecurityMetaTags: React.FC = () => (
  <MetaTags
    customMeta={[
      {
        httpEquiv: 'Content-Security-Policy',
        content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.royalhealthconsult.com;",
      },
      {
        httpEquiv: 'X-Frame-Options',
        content: 'DENY',
      },
      {
        httpEquiv: 'X-Content-Type-Options',
        content: 'nosniff',
      },
      {
        httpEquiv: 'Referrer-Policy',
        content: 'strict-origin-when-cross-origin',
      },
      {
        httpEquiv: 'Permissions-Policy',
        content: 'camera=(), microphone=(), geolocation=(self), encrypted-media=()',
      },
    ]}
    referrer="strict-origin-when-cross-origin"
  />
);

// SEO-optimized meta tags preset
export const SEOMetaTags: React.FC<{ 
  title?: string; 
  description?: string; 
  keywords?: string;
}> = ({ 
  title = 'Royal Health Consult - Professional Healthcare Services',
  description = 'Professional healthcare consultation services with qualified nurses in Lagos, Nigeria.',
  keywords = 'healthcare, nursing services, home healthcare, medical consultation, Lagos, Nigeria'
}) => (
  <MetaTags
    title={title}
    description={description}
    keywords={keywords}
    robots="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    customMeta={[
      {
        name: 'geo.region',
        content: 'NG-LA',
      },
      {
        name: 'geo.placename',
        content: 'Lagos',
      },
      {
        name: 'geo.position',
        content: '6.5244;3.3792',
      },
    ]}
  />
);

export default MetaTags;