// frontend/src/components/common/SkipLink.tsx
import React from 'react';
import {
  Box,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({
  href = '#main-content',
  children = 'Skip to main content',
}) => {
  const bgColor = useColorModeValue('blue.600', 'blue.300');
  const color = useColorModeValue('white', 'gray.900');

  return (
    <Link
      href={href}
      position="absolute"
      top="-40px"
      left="6px"
      zIndex="skipLink"
      bg={bgColor}
      color={color}
      px={4}
      py={2}
      borderRadius="md"
      fontSize="sm"
      fontWeight="medium"
      textDecoration="none"
      transform="translateY(-100%)"
      transition="transform 0.3s ease"
      _focus={{
        transform: 'translateY(0%)',
        outline: '2px solid',
        outlineColor: 'orange.400',
        outlineOffset: '2px',
      }}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('blue.700', 'blue.400'),
      }}
    >
      {children}
    </Link>
  );
};

// Multiple skip links component
export const SkipLinks: React.FC = () => {
  return (
    <Box as="nav" aria-label="Skip links" role="navigation">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      <SkipLink href="#footer">Skip to footer</SkipLink>
    </Box>
  );
};

export default SkipLink;