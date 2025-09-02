// frontend/src/components/common/LazyImage.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Image,
  Skeleton,
  useColorModeValue,
} from '@chakra-ui/react';

interface LazyImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  loading?: 'lazy' | 'eager';
  placeholder?: 'skeleton' | 'blur' | 'color';
  placeholderColor?: string;
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  quality?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  width = '100%',
  height = 'auto',
  borderRadius = '0',
  objectFit = 'cover',
  loading = 'lazy',
  placeholder = 'skeleton',
  placeholderColor,
  sizes,
  srcSet,
  onLoad,
  onError,
  priority = false,
  quality = 75,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const skeletonColor = useColorModeValue('gray.200', 'gray.700');
  const defaultPlaceholderColor = placeholderColor || skeletonColor;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (observerRef.current && imgRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current && observerRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Generate optimized image URL with quality parameter
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.startsWith('http') && quality < 100) {
      // For external images, you might want to use a service like Cloudinary or ImageKit
      return originalSrc;
    }
    return originalSrc;
  };

  const imageSrc = hasError ? fallbackSrc : getOptimizedSrc(src);

  return (
    <Box
      position="relative"
      width={width}
      height={height}
      borderRadius={borderRadius}
      overflow="hidden"
    >
      {/* Placeholder */}
      {!isLoaded && placeholder === 'skeleton' && (
        <Skeleton
          width="100%"
          height={height === 'auto' ? '200px' : height}
          borderRadius={borderRadius}
        />
      )}

      {!isLoaded && placeholder === 'color' && (
        <Box
          width="100%"
          height={height === 'auto' ? '200px' : height}
          bg={defaultPlaceholderColor}
          borderRadius={borderRadius}
        />
      )}

      {!isLoaded && placeholder === 'blur' && (
        <Box
          width="100%"
          height={height === 'auto' ? '200px' : height}
          borderRadius={borderRadius}
          bg={defaultPlaceholderColor}
          filter="blur(5px)"
          backgroundImage={`url(${imageSrc})`}
          backgroundSize={objectFit}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
        />
      )}

      {/* Actual Image */}
      {(isInView || priority) && (
        <Image
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          objectFit={objectFit}
          borderRadius={borderRadius}
          loading={loading}
          sizes={sizes}
          srcSet={srcSet}
          onLoad={handleLoad}
          onError={handleError}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.3s ease-in-out"
          position={isLoaded ? 'static' : 'absolute'}
          top={0}
          left={0}
          fallbackSrc={fallbackSrc}
        />
      )}

      {/* Loading overlay for blur placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          color="white"
          fontSize="sm"
          fontWeight="medium"
          bg="blackAlpha.600"
          px={3}
          py={1}
          borderRadius="full"
        >
          Loading...
        </Box>
      )}
    </Box>
  );
};

// Preset components for common use cases
export const ProfileImage: React.FC<{
  src: string;
  alt: string;
  size?: string;
}> = ({ src, alt, size = '100px' }) => (
  <LazyImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    borderRadius="full"
    objectFit="cover"
    placeholder="skeleton"
  />
);

export const HeroImage: React.FC<{
  src: string;
  alt: string;
  height?: string;
}> = ({ src, alt, height = '400px' }) => (
  <LazyImage
    src={src}
    alt={alt}
    width="100%"
    height={height}
    objectFit="cover"
    priority={true}
    placeholder="blur"
    quality={90}
  />
);

export const CardImage: React.FC<{
  src: string;
  alt: string;
  height?: string;
}> = ({ src, alt, height = '200px' }) => (
  <LazyImage
    src={src}
    alt={alt}
    width="100%"
    height={height}
    borderRadius="md"
    objectFit="cover"
    placeholder="skeleton"
  />
);

export const ThumbnailImage: React.FC<{
  src: string;
  alt: string;
  size?: string;
}> = ({ src, alt, size = '80px' }) => (
  <LazyImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    borderRadius="md"
    objectFit="cover"
    placeholder="color"
  />
);

export default LazyImage;