// frontend/src/components/common/SEO.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  locale?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Royal Health Consult - Professional Healthcare Services',
  description = 'Professional healthcare consultation services with qualified nurses. Book home visits, health assessments, and medical care in Lagos, Nigeria.',
  keywords = ['healthcare', 'nursing services', 'home healthcare', 'medical consultation', 'health assessment', 'Lagos', 'Nigeria'],
  author = 'Royal Health Consult',
  image = '/og-image.jpg',
  url,
  type = 'website',
  siteName = 'Royal Health Consult',
  locale = 'en_US',
  twitterCard = 'summary_large_image',
  noIndex = false,
  noFollow = false,
  canonical,
  schema,
}) => {
  // Get current URL if not provided
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const canonicalUrl = canonical || currentUrl;

  // Construct full image URL
  const fullImageUrl = image?.startsWith('http') 
    ? image 
    : `${currentUrl.split('/').slice(0, 3).join('/')}${image}`;

  // Create robots content
  const robots = `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {image && <meta property="og:image" content={fullImageUrl} />}
      {image && <meta property="og:image:alt" content={title} />}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={fullImageUrl} />}
      {image && <meta name="twitter:image:alt" content={title} />}
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#4F46E5" />
      <meta name="msapplication-TileColor" content="#4F46E5" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Geo Meta Tags for Local Business */}
      <meta name="geo.region" content="NG-LA" />
      <meta name="geo.placename" content="Lagos" />
      <meta name="geo.position" content="6.5244;3.3792" />
      <meta name="ICBM" content="6.5244, 3.3792" />
      
      {/* Business/Contact Meta Tags */}
      <meta name="contact" content="info@royalhealthconsult.com" />
      <meta name="reply-to" content="info@royalhealthconsult.com" />
      
      {/* Language and Region */}
      <html lang="en" />
      
      {/* Structured Data Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

// Preset SEO configurations for common pages
export const HomeSEO: React.FC = () => (
  <SEO
    title="Royal Health Consult - Professional Home Healthcare Services in Lagos"
    description="Get professional healthcare services at home in Lagos, Nigeria. Qualified nurses, health assessments, medical consultations, and personalized care. Book your appointment today."
    keywords={['home healthcare Lagos', 'nursing services Nigeria', 'health assessment', 'medical consultation', 'home nursing']}
    schema={{
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Royal Health Consult",
      "description": "Professional home healthcare services in Lagos, Nigeria",
      "url": "https://royalhealthconsult.com",
      "telephone": "+234-XXX-XXX-XXXX",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lagos",
        "addressRegion": "Lagos State",
        "addressCountry": "Nigeria"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "6.5244",
          "longitude": "3.3792"
        },
        "geoRadius": "50000"
      }
    }}
  />
);

export const AboutSEO: React.FC = () => (
  <SEO
    title="About Royal Health Consult - Professional Healthcare Team"
    description="Learn about Royal Health Consult's mission to provide quality healthcare services. Meet our qualified nurses and healthcare professionals serving Lagos, Nigeria."
    keywords={['about royal health', 'healthcare team Lagos', 'qualified nurses Nigeria', 'healthcare mission']}
    type="article"
  />
);

export const ServicesSEO: React.FC = () => (
  <SEO
    title="Healthcare Services - Royal Health Consult Lagos"
    description="Comprehensive healthcare services including home visits, health assessments, medical consultations, and nursing care in Lagos, Nigeria. Professional and affordable."
    keywords={['healthcare services Lagos', 'home nursing', 'medical consultation', 'health assessment', 'nursing care']}
  />
);

export const ContactSEO: React.FC = () => (
  <SEO
    title="Contact Royal Health Consult - Book Healthcare Services Lagos"
    description="Contact Royal Health Consult to book healthcare services in Lagos. Get professional nursing care, health assessments, and medical consultations at home."
    keywords={['contact royal health', 'book healthcare Lagos', 'nursing appointment', 'healthcare booking']}
  />
);

export const BookingSEO: React.FC = () => (
  <SEO
    title="Book Healthcare Appointment - Royal Health Consult"
    description="Book your healthcare appointment with Royal Health Consult. Schedule home visits, health assessments, and nursing services in Lagos, Nigeria."
    keywords={['book healthcare appointment', 'schedule nursing service', 'healthcare booking Lagos']}
  />
);

export default SEO;