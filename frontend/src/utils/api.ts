// src/utils/api.ts - API helper with automatic token handling

// Dynamic API base URL - uses Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                    'https://royal-health.onrender.com/api/v1';

// For debugging - log which URL is being used
console.log('🔗 API Base URL:', API_BASE_URL);

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
  statusCode?: number;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper function to handle logout on 401
const handleUnauthorized = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  // Redirect to login page
  window.location.href = '/login';
};

// Helper function to wake up backend (for Render free tier)
const wakeUpBackend = async (): Promise<void> => {
  try {
    // Make a simple request to wake up the backend
    await fetch(API_BASE_URL.replace('/api/v1', '/health'), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log('Backend wake-up request sent...');
  }
};

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    // Wake up backend before first request (helps with Render free tier)
    if (API_BASE_URL.includes('onrender.com')) {
      await wakeUpBackend();
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle different response statuses
    if (response.status === 401) {
      handleUnauthorized();
      throw new ApiError(401, 'Unauthorized - please login again');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    console.error('API request failed:', error);
    throw new ApiError(0, 'Network error - please check your connection');
  }
};

// Specific API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (userData: any) =>
      apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    profile: () => apiRequest('/auth/profile'),

    logout: () =>
      apiRequest('/auth/logout', {
        method: 'POST',
      }),
  },

  // Users endpoints
  users: {
    getProfile: () => apiRequest('/users/profile'),
    
    updateProfile: (userData: any) =>
      apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),

    getStats: () => apiRequest('/users/stats'),

    getAll: (params?: any) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest(`/users${queryString}`);
    },
  },

  // Future: Bookings endpoints
  bookings: {
    // Will be implemented when booking APIs are added
  },

  // Future: Nurses endpoints
  nurses: {
    // Will be implemented when nurse APIs are added
  },
};

export default api;