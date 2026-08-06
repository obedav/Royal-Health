import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Icon,
} from '@chakra-ui/react'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import { API_CONFIG } from '../../config/api.config'

const ADMIN_AUTH_KEY = 'rh_admin_auth'
const API_BASE = API_CONFIG.BASE_URL
const SESSION_DURATION_MS = 60 * 60 * 1000 // 1 hour

interface AdminAuth {
  token: string
  expiresAt: number
}

function getStoredAdminAuth(): AdminAuth | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_AUTH_KEY)
    if (!raw) return null
    const auth: AdminAuth = JSON.parse(raw)
    if (Date.now() >= auth.expiresAt) {
      sessionStorage.removeItem(ADMIN_AUTH_KEY)
      return null
    }
    return auth
  } catch {
    return null
  }
}

interface Props {
  children: React.ReactNode
}

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsAuthenticated(getStoredAdminAuth() !== null)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
      const data = res.data?.data

      if (!data) {
        setError('Invalid response from server.')
        return
      }

      if (data.role !== 'admin') {
        setError('Access denied. Admin credentials required.')
        return
      }

      const token: string = data.accessToken
      if (!token) {
        setError('Authentication token missing from response.')
        return
      }

      const auth: AdminAuth = { token, expiresAt: Date.now() + SESSION_DURATION_MS }
      sessionStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(auth))
      setIsAuthenticated(true)
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? 'Login failed. Please check your credentials.'
          : 'An unexpected error occurred.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Resolving initial auth check — render nothing to avoid flash
  if (isAuthenticated === null) return null

  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Box
          bg="white"
          p={10}
          rounded="2xl"
          shadow="lg"
          w="full"
          maxW="420px"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Center mb={8}>
            <VStack spacing={3}>
              <Box
                w={14}
                h={14}
                bgGradient="linear(45deg, brand.500, purple.500)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaLock} color="white" fontSize="xl" />
              </Box>
              <Heading
                size="lg"
                bgGradient="linear(45deg, brand.600, purple.600)"
                bgClip="text"
                sx={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Admin Access
              </Heading>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                This area is restricted to Royal Health administrators.
              </Text>
            </VStack>
          </Center>

          {error && (
            <Alert status="error" rounded="md" mb={6}>
              <AlertIcon />
              <Text fontSize="sm">{error}</Text>
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@royalhealthconsult.com"
                  autoComplete="username"
                  size="lg"
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  Password
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    focusBorderColor="brand.500"
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      <Icon as={showPassword ? FaEyeSlash : FaEye} color="gray.500" />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                size="lg"
                w="full"
                bgGradient="linear(45deg, brand.500, purple.500)"
                color="white"
                _hover={{ bgGradient: 'linear(45deg, brand.600, purple.600)' }}
                isLoading={isLoading}
                loadingText="Verifying..."
                mt={2}
              >
                Sign In
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    )
  }

  return <>{children}</>
}

export default ProtectedAdminRoute
