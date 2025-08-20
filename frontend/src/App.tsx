// src/App.tsx - Updated with proper route protection and About/Contact components
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import theme from './styles/theme'
import './styles/globals.css'


// Import components
import Header from './components/common/Header'
import { AuthProvider, ProtectedRoute } from './hooks/useAuth'

// Import pages
import Home from './pages/Home'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'


// Admin components (if you want to add admin routes)
// import AdminDashboard from './components/admin/AdminDashboard'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/booking" 
                    element={
                      <ProtectedRoute>
                        <Booking />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin routes (uncomment if you want admin access) */}
                  {/*
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  */}
                  
                  {/* Catch all route - 404 page */}
                  <Route 
                    path="*" 
                    element={
                      <div style={{ 
                        padding: '80px 40px', 
                        textAlign: 'center', 
                        minHeight: '60vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <h1 style={{ fontSize: '4rem', color: '#E53E3E', marginBottom: '1rem' }}>404</h1>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2D3748' }}>Page Not Found</h2>
                        <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '2rem' }}>
                          The page you're looking for doesn't exist.
                        </p>
                        <a 
                          href="/" 
                          style={{ 
                            padding: '12px 24px', 
                            backgroundColor: '#9F7AEA', 
                            color: 'white', 
                            textDecoration: 'none', 
                            borderRadius: '8px',
                            fontSize: '1.1rem'
                          }}
                        >
                          Go Back Home
                        </a>
                      </div>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </ChakraProvider>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

export default App