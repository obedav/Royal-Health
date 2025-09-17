import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Center, VStack, Spinner, Text } from '@chakra-ui/react'
import ErrorBoundary from '../components/common/ErrorBoundary'
import PageLoader from '../components/common/PageLoader'
import { ROUTES } from '../config/app.config'

// Lazy load pages for better performance
const Home = React.lazy(() => import('../pages/Home'))
const ServicesUnified = React.lazy(() => import('../pages/ServicesUnified'))
const Services = React.lazy(() => import('../pages/Services'))
const Booking = React.lazy(() => import('../pages/Booking'))
const About = React.lazy(() => import('../pages/About'))
const Contact = React.lazy(() => import('../pages/Contact'))
const Consultation = React.lazy(() => import('../pages/Consultation'))
const AdminConsultations = React.lazy(() => import('../pages/AdminConsultations'))

// Loading component for lazy-loaded routes
const RouteLoader: React.FC = () => (
  <Box minH="60vh">
    <Center h="60vh">
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
        <Text color="gray.600" fontSize="lg" fontWeight="500">
          Loading page...
        </Text>
      </VStack>
    </Center>
  </Box>
)

// Route wrapper with error boundary
const RouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<RouteLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
)

// 404 Page Component
const NotFound: React.FC = () => (
  <Box minH="60vh" py={20}>
    <Center>
      <VStack spacing={6} textAlign="center">
        <Text
          fontSize="8xl"
          fontWeight="bold"
          bgGradient="linear(45deg, brand.500, purple.500)"
          bgClip="text"
          sx={{
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </Text>
        <VStack spacing={2}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Page Not Found
          </Text>
          <Text color="gray.600" maxW="400px" lineHeight="1.6">
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </VStack>
        <Box mt={6}>
          <Text
            as="a"
            href="/"
            color="brand.500"
            fontWeight="bold"
            textDecoration="underline"
            _hover={{ color: "brand.600" }}
          >
            ← Back to Home
          </Text>
        </Box>
      </VStack>
    </Center>
  </Box>
)

// Main App Router Component
const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.HOME}
        element={
          <RouteWrapper>
            <Home />
          </RouteWrapper>
        }
      />

      <Route
        path={ROUTES.SERVICES}
        element={
          <RouteWrapper>
            <ServicesUnified />
          </RouteWrapper>
        }
      />

      {/* Legacy services route for backward compatibility */}
      <Route
        path="/services-old"
        element={
          <RouteWrapper>
            <Services />
          </RouteWrapper>
        }
      />

      <Route
        path={ROUTES.ABOUT}
        element={
          <RouteWrapper>
            <About />
          </RouteWrapper>
        }
      />

      <Route
        path={ROUTES.CONTACT}
        element={
          <RouteWrapper>
            <Contact />
          </RouteWrapper>
        }
      />

      {/* Booking Routes */}
      <Route
        path={ROUTES.BOOKING}
        element={
          <RouteWrapper>
            <Booking />
          </RouteWrapper>
        }
      />

      <Route
        path={ROUTES.CONSULTATION}
        element={
          <RouteWrapper>
            <Consultation />
          </RouteWrapper>
        }
      />

      {/* Admin Routes */}
      <Route
        path={ROUTES.ADMIN.CONSULTATIONS}
        element={
          <RouteWrapper>
            <AdminConsultations />
          </RouteWrapper>
        }
      />

      {/* Redirect legacy routes */}
      <Route path="/book" element={<Navigate to={ROUTES.SERVICES} replace />} />
      <Route path="/book-service" element={<Navigate to={ROUTES.SERVICES} replace />} />
      <Route path="/service/:id" element={<Navigate to={ROUTES.SERVICES} replace />} />

      {/* 404 Route - must be last */}
      <Route
        path="*"
        element={
          <RouteWrapper>
            <NotFound />
          </RouteWrapper>
        }
      />
    </Routes>
  )
}

export default AppRouter