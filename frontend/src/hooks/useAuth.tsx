// src/hooks/useAuth.tsx - Fixed to use only your custom API
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center, VStack, Text } from '@chakra-ui/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'client' | 'nurse' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  state?: string;
  city?: string;
  avatar?: string;
  preferredLanguage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: 'client' | 'nurse' | 'admin';
  state?: string;
  city?: string;
  preferredLanguage?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            
            // Verify token is still valid by calling profile endpoint
            await fetchUserProfile(token);
          } catch (error) {
            console.error('Error loading saved user:', error);
            // Clear invalid data
            clearAuthData();
          }
        } else {
          // No valid tokens, clear everything
          clearAuthData();
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data || data.user);
        localStorage.setItem('user', JSON.stringify(data.data || data.user));
      } else if (response.status === 401) {
        // Token is invalid, clear auth data
        logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // On network error, keep existing user data but don't logout
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🚀 Starting registration with custom API...');
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('📊 Registration response:', { status: response.status, data });

      if (response.ok) {
        // Registration successful
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
        }
        
        console.log('✅ Registration successful');
        return { success: true };
      } else {
        console.error('❌ Registration failed:', data.message);
        return { 
          success: false, 
          error: data.message || 'Registration failed. Please try again.' 
        };
      }
    } catch (error: any) {
      console.error('❌ Registration network error:', error);
      return { 
        success: false, 
        error: error.message || 'Network error. Please check your connection and try again.' 
      };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🚀 Starting login with custom API...');
      console.log('API URL:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password 
        }),
      });

      console.log('📊 Login response status:', response.status);
      
      const data = await response.json();
      console.log('📊 Login response data:', data);

      if (response.ok) {
        // Login successful
        console.log('✅ Login successful');
        
        if (data.accessToken || data.token) {
          localStorage.setItem('accessToken', data.accessToken || data.token);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.user || data.data) {
          const userData = data.user || data.data;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        return { success: true };
      } else {
        console.error('❌ Login failed:', data.message);
        
        // Handle specific error messages
        let errorMessage = data.message || 'Login failed';
        
        if (data.message && data.message.includes('Invalid credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (data.message && data.message.includes('Account locked')) {
          errorMessage = 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later.';
        } else if (data.message && data.message.includes('Email not verified')) {
          errorMessage = 'Please verify your email address before logging in.';
        }
        
        return { 
          success: false, 
          error: errorMessage
        };
      }
    } catch (error: any) {
      console.error('❌ Login network error:', error);
      
      let errorMessage = 'Network error. Please check your connection and try again.';
      
      if (error.message && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    clearAuthData();
    
    // Optional: Call logout endpoint to invalidate token on server
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.error('Error during server logout:', error);
        // Don't throw error here since we're already logging out
      });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ProtectedRoute Component
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('client' | 'nurse' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  allowedRoles
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check user role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User doesn't have required role, redirect to appropriate page
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'nurse':
        return <Navigate to="/nurse-dashboard" replace />;
      case 'client':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};