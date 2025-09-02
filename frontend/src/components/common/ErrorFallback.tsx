// frontend/src/components/common/ErrorFallback.tsx
import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaRedo, FaHome, FaExclamationTriangle } from 'react-icons/fa';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  minimal?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  minimal = false,
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('red.300', 'red.600');

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (minimal) {
    return (
      <Alert
        status="error"
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription display="block" mt={1}>
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </AlertDescription>
        </Box>
        <Button size="sm" onClick={handleRefresh} leftIcon={<FaRedo />}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="4xl">
        <VStack spacing={8} align="center" justify="center" minH="80vh">
          {/* Error Icon */}
          <Box color="red.500" fontSize="4xl">
            <FaExclamationTriangle />
          </Box>

          {/* Main Error Alert */}
          <Alert
            status="error"
            borderRadius="2xl"
            p={8}
            maxW="2xl"
            flexDirection="column"
            textAlign="center"
            border="2px solid"
            borderColor={borderColor}
            bg={cardBg}
            boxShadow="0 10px 25px rgba(220, 38, 38, 0.15)"
          >
            <AlertIcon boxSize="3rem" />
            <Box>
              <AlertTitle fontSize="2xl" fontWeight="800" mb={4}>
                Oops! Something went wrong
              </AlertTitle>
              <AlertDescription fontSize="md" fontWeight="500" lineHeight="1.6">
                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
              </AlertDescription>
            </Box>
          </Alert>

          {/* Action Buttons */}
          <VStack spacing={4}>
            <Button
              colorScheme="red"
              size="lg"
              onClick={handleRefresh}
              borderRadius="xl"
              px={8}
              py={6}
              leftIcon={<FaRedo />}
            >
              Try Again
            </Button>
            
            <Button
              variant="outline"
              colorScheme="red"
              size="lg"
              onClick={handleGoHome}
              borderRadius="xl"
              px={8}
              py={6}
              leftIcon={<FaHome />}
            >
              Go to Homepage
            </Button>
          </VStack>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && error && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="xl"
              p={6}
              maxW="2xl"
              w="full"
              maxH="300px"
              overflowY="auto"
            >
              <Heading size="sm" color="red.700" mb={4}>
                Error Details (Development Mode)
              </Heading>
              <Text 
                fontSize="sm" 
                color="red.800" 
                fontFamily="mono" 
                bg="red.100" 
                p={2} 
                borderRadius="md"
              >
                {error.message}
              </Text>
              {error.stack && (
                <Text 
                  fontSize="xs" 
                  color="red.700" 
                  fontFamily="mono" 
                  bg="red.100" 
                  p={2} 
                  borderRadius="md"
                  mt={2}
                  whiteSpace="pre-wrap"
                  overflowX="auto"
                >
                  {error.stack}
                </Text>
              )}
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ErrorFallback;