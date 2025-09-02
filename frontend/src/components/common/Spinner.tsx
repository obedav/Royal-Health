// frontend/src/components/common/Spinner.tsx
import React from 'react';
import {
  Box,
  Spinner as ChakraSpinner,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: string;
  speed?: string;
  label?: string;
  variant?: 'default' | 'overlay' | 'inline';
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue.500',
  thickness = '4px',
  speed = '0.65s',
  label,
  variant = 'default',
}) => {
  const overlayBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)');
  
  const spinnerElement = (
    <ChakraSpinner
      size={size}
      color={color}
      thickness={thickness}
      speed={speed}
    />
  );

  if (variant === 'inline') {
    return spinnerElement;
  }

  if (variant === 'overlay') {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        bg={overlayBg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex="9999"
        backdropFilter="blur(2px)"
      >
        <VStack spacing={4}>
          {spinnerElement}
          {label && (
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {label}
            </Text>
          )}
        </VStack>
      </Box>
    );
  }

  // Default variant
  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={8}>
      <VStack spacing={4}>
        {spinnerElement}
        {label && (
          <Text fontSize="sm" color="gray.600" fontWeight="medium">
            {label}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

// Preset spinner components for common use cases
export const PageSpinner: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <Spinner variant="default" size="lg" label={label} />
);

export const OverlaySpinner: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <Spinner variant="overlay" size="lg" label={label} />
);

export const InlineSpinner: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'sm' }) => (
  <Spinner variant="inline" size={size} />
);

export const ButtonSpinner: React.FC = () => (
  <Spinner variant="inline" size="sm" color="white" />
);

export default Spinner;