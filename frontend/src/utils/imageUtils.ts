// Image utilities for fallback handling and optimization

// Default fallback images for different service categories
export const DEFAULT_IMAGES = {
  ASSESSMENT: '/images/assessment.jpg',
  HOMECARE: '/images/care-img.jpeg',
  SPECIALIZED: '/images/specialized-care.jpg',
  GENERAL: '/images/default-service.jpg',
  PLACEHOLDER: '/images/placeholder.jpg'
} as const

// Service-specific image mappings with fallbacks
export const SERVICE_IMAGES: Record<string, string> = {
  // Assessment services
  'general-health-assessment': '/images/general.jpg',
  'elderly-care-assessment': '/images/elderly.jpg',
  'chronic-condition-assessment': '/images/chronic.jpg',
  'post-surgery-assessment': '/images/post-surgery.jpg',
  'mental-health-screening': '/images/mental.jpg',
  'maternal-health-assessment': '/images/maternal.jpg',
  'pediatric-assessment': '/images/pediatric.jpg',
  'routine-checkup': '/images/routine.jpg',
  'emergency-assessment': '/images/emergency.jpg',

  // Home care services
  'home-nursing': '/images/care-img.jpeg',
  'mother-baby-care': '/images/m-care.png',
  'wound-dressing': '/images/wound-img.png',

  // Specialized care
  'physiotherapy': '/images/physiotherapy.jpg',
  'dementia-care': '/images/dementia-care.jpg',
}

// Get image with proper fallback handling
export const getServiceImage = (serviceId: string, category: string = 'general'): string => {
  // Try to get service-specific image first
  const serviceImage = SERVICE_IMAGES[serviceId]
  if (serviceImage) {
    return serviceImage
  }

  // Fall back to category-specific default
  switch (category) {
    case 'assessment':
    case 'general':
    case 'specialized':
    case 'emergency':
    case 'routine':
      return DEFAULT_IMAGES.ASSESSMENT
    case 'homecare':
    case 'nursing':
      return DEFAULT_IMAGES.HOMECARE
    case 'therapy':
      return DEFAULT_IMAGES.SPECIALIZED
    default:
      return DEFAULT_IMAGES.GENERAL
  }
}

// Image loading with error handling
export const loadImageWithFallback = (
  primarySrc: string,
  fallbackSrc: string = DEFAULT_IMAGES.PLACEHOLDER
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => resolve(primarySrc)
    img.onerror = () => {
      // Try fallback image
      const fallbackImg = new Image()
      fallbackImg.onload = () => resolve(fallbackSrc)
      fallbackImg.onerror = () => resolve(DEFAULT_IMAGES.PLACEHOLDER)
      fallbackImg.src = fallbackSrc
    }

    img.src = primarySrc
  })
}

// Image optimization utilities
export const getOptimizedImageUrl = (
  src: string,
  width?: number,
  height?: number,
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string => {
  // If using a CDN or image optimization service, construct optimized URL
  // For now, return original src with potential format conversion

  // Example for future CDN integration:
  // return `https://your-cdn.com/transform/w_${width},h_${height},f_${format}/${src}`

  return src
}

// Check if image exists
export const checkImageExists = async (src: string): Promise<boolean> => {
  try {
    const response = await fetch(src, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

// Preload critical images
export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  const promises = imageUrls.map(url => {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve() // Resolve anyway to not block
      img.src = url
    })
  })

  return Promise.all(promises)
}

// Critical images to preload for better performance
export const CRITICAL_IMAGES = [
  DEFAULT_IMAGES.ASSESSMENT,
  DEFAULT_IMAGES.HOMECARE,
  DEFAULT_IMAGES.GENERAL,
  SERVICE_IMAGES['general-health-assessment'],
  SERVICE_IMAGES['elderly-care-assessment'],
  SERVICE_IMAGES['home-nursing']
]