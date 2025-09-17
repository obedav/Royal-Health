import { useState, useEffect } from 'react'
import { Box, BoxProps, Spinner, Center } from '@chakra-ui/react'
import { getServiceImage, loadImageWithFallback, DEFAULT_IMAGES } from '../../utils/imageUtils'

interface ServiceImageProps extends Omit<BoxProps, 'children'> {
  serviceId?: string
  category?: string
  src?: string
  fallbackSrc?: string
  showLoader?: boolean
  alt?: string
}

const ServiceImage: React.FC<ServiceImageProps> = ({
  serviceId,
  category = 'general',
  src,
  fallbackSrc,
  showLoader = true,
  alt = 'Service image',
  ...boxProps
}) => {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        // Determine primary image source
        let primarySrc = src
        if (!primarySrc && serviceId) {
          primarySrc = getServiceImage(serviceId, category)
        }
        if (!primarySrc) {
          primarySrc = DEFAULT_IMAGES.GENERAL
        }

        // Determine fallback source
        const fallback = fallbackSrc || getServiceImage('', category)

        // Load image with fallback
        const loadedSrc = await loadImageWithFallback(primarySrc, fallback)
        setImageSrc(loadedSrc)
      } catch (error) {
        console.warn('Failed to load service image:', error)
        setImageSrc(DEFAULT_IMAGES.PLACEHOLDER)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [serviceId, category, src, fallbackSrc])

  return (
    <Box
      position="relative"
      overflow="hidden"
      {...boxProps}
    >
      {isLoading && showLoader && (
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="gray.100"
          zIndex={1}
        >
          <Spinner size="lg" color="brand.500" />
        </Center>
      )}

      {imageSrc && (
        <Box
          as="img"
          src={imageSrc}
          alt={alt}
          w="full"
          h="full"
          objectFit="cover"
          opacity={isLoading ? 0 : 1}
          transition="opacity 0.3s ease-in-out"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        />
      )}

      {hasError && !isLoading && (
        <Center
          w="full"
          h="full"
          bg="gray.100"
          color="gray.500"
          fontSize="sm"
          fontWeight="500"
        >
          Image unavailable
        </Center>
      )}
    </Box>
  )
}

export default ServiceImage