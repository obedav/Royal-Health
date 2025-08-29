import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, Spinner, Center, VStack, Text } from "@chakra-ui/react";

// Better API_BASE_URL handling with validation
const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const fallbackUrl = "http://localhost:3001/api/v1";

  if (!envUrl || envUrl === "undefined") {
    console.warn(
      "⚠️ VITE_API_BASE_URL is not set, using fallback:",
      fallbackUrl
    );
    return fallbackUrl;
  }

  console.log("✅ Using API_BASE_URL:", envUrl);
  return envUrl;
})();

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "client" | "nurse" | "admin";
  status: "active" | "inactive" | "suspended" | "pending_verification";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  state?: string;
  city?: string;
  avatar?: string;
  preferredLanguage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
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
  role?: "client" | "nurse" | "admin";
  state?: string;
  city?: string;
  preferredLanguage?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && parsedUser.id && parsedUser.email) {
              setUser(parsedUser);
              // Optionally verify token is still valid
              // await fetchUserProfile(token);
            } else {
              clearAuthData();
            }
          } catch (error) {
            console.error("Error loading saved user:", error);
            clearAuthData();
          }
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = async (
    userData: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("🚀 Starting registration...");
      console.log("API URL:", `${API_BASE_URL}/auth/register`);

      // Validate required fields
      if (
        !userData.email ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName
      ) {
        return {
          success: false,
          error: "Please fill in all required fields.",
        };
      }

      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          error: "Passwords do not match.",
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email.trim().toLowerCase(),
          phone: userData.phone,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          role: userData.role || "client",
          preferredLanguage: userData.preferredLanguage || "en",
        }),
      });

      console.log("📊 Registration response status:", response.status);

      if (!response.ok) {
        // Handle non-200 responses
        let errorMessage = "Registration failed. Please try again.";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
        }

        if (response.status === 409) {
          errorMessage = "An account with this email already exists.";
        } else if (response.status === 422) {
          errorMessage = "Please check your information and try again.";
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      const data = await response.json();
      console.log("✅ Registration successful");

      // Store authentication data
      if (data.accessToken || data.token) {
        localStorage.setItem("accessToken", data.accessToken || data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (data.user || data.data) {
        const userInfo = data.user || data.data;
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
      }

      return { success: true };
    } catch (error: any) {
      console.error("❌ Registration network error:", error);

      let errorMessage =
        "Network error. Please check your connection and try again.";

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("🚀 Starting login...");
      console.log("API URL:", `${API_BASE_URL}/auth/login`);

      if (!email.trim() || !password) {
        return {
          success: false,
          error: "Please enter both email and password.",
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      console.log("📊 Login response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Login failed. Please try again.";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
        }

        if (response.status === 401) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (response.status === 423) {
          errorMessage =
            "Your account has been temporarily locked. Please try again later.";
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      const data = await response.json();
      console.log("✅ Login successful");

      // Store authentication data
      if (data.accessToken || data.token) {
        localStorage.setItem("accessToken", data.accessToken || data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (data.user || data.data) {
        const userData = data.user || data.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }

      return { success: true };
    } catch (error: any) {
      console.error("❌ Login network error:", error);

      let errorMessage =
        "Network error. Please check your connection and try again.";

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    console.log("🚪 Logging out user");

    // Get token before clearing data
    const token = localStorage.getItem("accessToken");

    // Clear local data first
    clearAuthData();

    // Optional: Call logout endpoint to invalidate token on server
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Error during server logout:", error);
        // Don't throw error here since we're already logged out locally
      });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ProtectedRoute Component
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ("client" | "nurse" | "admin")[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles,
  redirectPath,
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
  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with the current location as state
    return (
      <Navigate
        to={redirectPath || "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  // If specific roles are required, check user role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User doesn't have required role, redirect to appropriate page
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin-dashboard" replace />;
      case "nurse":
        return <Navigate to="/nurse-dashboard" replace />;
      case "client":
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};
