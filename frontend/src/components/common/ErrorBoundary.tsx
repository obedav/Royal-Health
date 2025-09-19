// frontend/src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
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
} from '@chakra-ui/react';
import { FaRedo, FaHome } from 'react-icons/fa';

// Type declarations for global error monitoring
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: any) => void;
    };
  }
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // Send error to monitoring service in production
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Report to external monitoring service
    if (typeof window !== 'undefined') {
      // Check for Sentry
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          contexts: {
            react: errorInfo,
            user: {
              userAgent: navigator.userAgent,
              url: window.location.href,
              timestamp: new Date().toISOString(),
            }
          }
        });
      }

      // Fallback: Send to our own error logging endpoint
      this.sendToErrorEndpoint(error, errorInfo);
    }
  }

  private sendToErrorEndpoint = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Skip error reporting to backend for now since endpoint is not implemented
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });

      // Don't throw for 404 since error endpoint may not be implemented yet
      if (!response.ok && response.status === 404) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error logging endpoint not available (404) - errors will only be logged locally');
        }
        return;
      }
    } catch (reportingError) {
      // Silently fail if error reporting fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to report error:', reportingError);
      }
    }
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box bg="gray.50" minH="100vh" py={8}>
          <Container maxW="4xl">
            <VStack spacing={8} align="center" justify="center" minH="80vh">
              <Alert
                status="error"
                borderRadius="2xl"
                p={8}
                maxW="2xl"
                flexDirection="column"
                textAlign="center"
                border="2px solid"
                borderColor="red.300"
                bg="white"
                boxShadow="0 10px 25px rgba(220, 38, 38, 0.15)"
              >
                <AlertIcon boxSize="3rem" />
                <Box>
                  <AlertTitle fontSize="2xl" fontWeight="800" mb={4}>
                    Oops! Something went wrong
                  </AlertTitle>
                  <AlertDescription fontSize="md" fontWeight="500" lineHeight="1.6">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </AlertDescription>
                </Box>
              </Alert>

              <VStack spacing={4}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={this.handleRefresh}
                  borderRadius="xl"
                  px={8}
                  py={6}
                  leftIcon={<FaRedo />}
                >
                  Refresh Page
                </Button>
                
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                  onClick={this.handleGoHome}
                  borderRadius="xl"
                  px={8}
                  py={6}
                  leftIcon={<FaHome />}
                >
                  Go to Homepage
                </Button>
              </VStack>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
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
                  <Text fontSize="sm" color="red.800" fontFamily="mono" bg="red.100" p={2} borderRadius="md">
                    {this.state.error.message}
                  </Text>
                  {this.state.error.stack && (
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
                      {this.state.error.stack}
                    </Text>
                  )}
                </Box>
              )}
            </VStack>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;