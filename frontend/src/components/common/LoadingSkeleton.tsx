// frontend/src/components/common/LoadingSkeleton.tsx
import React from 'react';
import {
  Box,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  VStack,
  HStack,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'profile' | 'table' | 'form' | 'dashboard';
  count?: number;
  height?: string | number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
  height = '200px',
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const renderCardSkeleton = () => (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack align="stretch" spacing={4}>
        <Skeleton height="200px" borderRadius="md" />
        <SkeletonText noOfLines={2} spacing="2" />
        <HStack justify="space-between">
          <Skeleton height="20px" width="80px" />
          <Skeleton height="32px" width="100px" borderRadius="md" />
        </HStack>
      </VStack>
    </Box>
  );

  const renderListSkeleton = () => (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
    >
      <HStack spacing={4}>
        <SkeletonCircle size="12" />
        <VStack align="stretch" flex="1" spacing={2}>
          <Skeleton height="20px" width="70%" />
          <Skeleton height="16px" width="40%" />
        </VStack>
        <Skeleton height="32px" width="80px" borderRadius="md" />
      </HStack>
    </Box>
  );

  const renderProfileSkeleton = () => (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={6}>
        <SkeletonCircle size="20" />
        <VStack spacing={3}>
          <Skeleton height="24px" width="200px" />
          <Skeleton height="16px" width="150px" />
          <Skeleton height="16px" width="180px" />
        </VStack>
        <HStack spacing={4}>
          <Skeleton height="40px" width="120px" borderRadius="md" />
          <Skeleton height="40px" width="120px" borderRadius="md" />
        </HStack>
      </VStack>
    </Box>
  );

  const renderTableSkeleton = () => (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
    >
      {/* Table Header */}
      <Box bg="gray.50" p={4} borderBottom="1px solid" borderColor={borderColor}>
        <HStack spacing={4}>
          <Skeleton height="16px" width="100px" />
          <Skeleton height="16px" width="120px" />
          <Skeleton height="16px" width="80px" />
          <Skeleton height="16px" width="90px" />
        </HStack>
      </Box>
      
      {/* Table Rows */}
      <VStack spacing={0}>
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            p={4}
            w="full"
            borderBottom={index < count - 1 ? "1px solid" : "none"}
            borderColor={borderColor}
          >
            <HStack spacing={4}>
              <Skeleton height="16px" width="100px" />
              <Skeleton height="16px" width="120px" />
              <Skeleton height="16px" width="80px" />
              <Skeleton height="16px" width="90px" />
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );

  const renderFormSkeleton = () => (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={6} align="stretch">
        <Skeleton height="24px" width="200px" />
        
        {Array.from({ length: count }).map((_, index) => (
          <VStack key={index} spacing={2} align="stretch">
            <Skeleton height="16px" width="120px" />
            <Skeleton height="40px" borderRadius="md" />
          </VStack>
        ))}
        
        <HStack spacing={4} justify="flex-end">
          <Skeleton height="40px" width="100px" borderRadius="md" />
          <Skeleton height="40px" width="100px" borderRadius="md" />
        </HStack>
      </VStack>
    </Box>
  );

  const renderDashboardSkeleton = () => (
    <VStack spacing={6} align="stretch">
      {/* Stats Cards */}
      <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            bg={bgColor}
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            flex="1"
          >
            <VStack spacing={4}>
              <SkeletonCircle size="12" />
              <VStack spacing={2}>
                <Skeleton height="32px" width="80px" />
                <Skeleton height="16px" width="100px" />
              </VStack>
            </VStack>
          </Box>
        ))}
      </Stack>
      
      {/* Chart Area */}
      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={4}>
          <Skeleton height="20px" width="200px" />
          <Skeleton height="300px" borderRadius="md" />
        </VStack>
      </Box>
    </VStack>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return renderCardSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      case 'table':
        return renderTableSkeleton();
      case 'form':
        return renderFormSkeleton();
      case 'dashboard':
        return renderDashboardSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  if (variant === 'dashboard' || variant === 'table' || variant === 'form' || variant === 'profile') {
    return <Box>{renderSkeleton()}</Box>;
  }

  return (
    <VStack spacing={4}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} w="full">
          {renderSkeleton()}
        </Box>
      ))}
    </VStack>
  );
};

export default LoadingSkeleton;