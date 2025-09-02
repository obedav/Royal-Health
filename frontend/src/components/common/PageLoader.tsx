// frontend/src/components/common/PageLoader.tsx
import React from 'react';
import {
  Box,
  VStack,
  Progress,
  Text,
  Image,
  keyframes,
  useColorModeValue,
} from '@chakra-ui/react';
import { OverlaySpinner } from './Spinner';

interface PageLoaderProps {
  variant?: 'spinner' | 'progress' | 'logo' | 'skeleton';
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

// Pulse animation for logo
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const PageLoader: React.FC<PageLoaderProps> = ({
  variant = 'spinner',
  message = 'Loading...',
  progress,
  showProgress = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  if (variant === 'spinner') {
    return <OverlaySpinner label={message} />;
  }

  if (variant === 'progress') {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        bg={bgColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex="9999"
      >
        <VStack spacing={6} maxW="300px" w="full" px={6}>
          <VStack spacing={4}>
            <Image
              src="/logo-img.jpg"
              alt="Royal Health"
              width="80px"
              height="80px"
              borderRadius="xl"
              animation={`${pulse} 2s ease-in-out infinite`}
            />
            <Text fontSize="lg" fontWeight="600" color={textColor}>
              Royal Health
            </Text>
          </VStack>
          
          <VStack spacing={2} w="full">
            <Progress
              value={progress || 0}
              colorScheme="blue"
              borderRadius="full"
              w="full"
              h="8px"
              isIndeterminate={!progress}
            />
            {showProgress && progress !== undefined && (
              <Text fontSize="sm" color={textColor}>
                {Math.round(progress)}%
              </Text>
            )}
            <Text fontSize="sm" color={textColor} textAlign="center">
              {message}
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  if (variant === 'logo') {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        bg={bgColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex="9999"
      >
        <VStack spacing={6}>
          <Box position="relative">
            <Image
              src="/logo-img.jpg"
              alt="Royal Health"
              width="120px"
              height="120px"
              borderRadius="2xl"
              animation={`${pulse} 1.5s ease-in-out infinite`}
            />
            
            {/* Animated border */}
            <Box
              position="absolute"
              top="-4px"
              left="-4px"
              right="-4px"
              bottom="-4px"
              borderRadius="2xl"
              border="4px solid"
              borderColor="blue.500"
              opacity="0.3"
              animation={`${pulse} 2s ease-in-out infinite reverse`}
            />
          </Box>
          
          <VStack spacing={2}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              Royal Health
            </Text>
            <Text fontSize="md" color={textColor}>
              {message}
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Default fallback
  return <OverlaySpinner label={message} />;
};

// Preset page loaders
export const AppLoader: React.FC = () => (
  <PageLoader variant="logo" message="Initializing application..." />
);

export const AuthLoader: React.FC = () => (
  <PageLoader variant="progress" message="Authenticating..." showProgress />
);

export const RouteLoader: React.FC<{ message?: string }> = ({ 
  message = "Loading page..." 
}) => (
  <PageLoader variant="spinner" message={message} />
);

export default PageLoader;