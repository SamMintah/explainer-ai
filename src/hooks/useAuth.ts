import { useState, useEffect, useCallback, useRef } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const TOKEN_KEY = 'explainer_auth_token';
const REFRESH_TOKEN_KEY = 'explainer_refresh_token';
const USER_KEY = 'explainer_user';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiration

// Utility function to decode JWT payload
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Utility function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Utility function to check if token needs refresh
const shouldRefreshToken = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return false;
  
  const currentTime = Date.now();
  const expirationTime = decoded.exp * 1000;
  return (expirationTime - currentTime) < TOKEN_REFRESH_THRESHOLD;
};

// API base URL - should match the server configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          if (isTokenExpired(storedToken)) {
            // Token is expired, try to refresh
            await refreshTokenInternal();
          } else {
            // Token is valid, set auth state
            const user = JSON.parse(storedUser);
            setAuthState({
              user,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
            });

            // Schedule token refresh if needed
            scheduleTokenRefresh(storedToken);
          }
        } else {
          // No stored auth data
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();

    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Clear auth data from localStorage
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  // Store auth data in localStorage
  const storeAuthData = useCallback((authResponse: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  }, []);

  // Schedule automatic token refresh
  const scheduleTokenRefresh = useCallback((token: string) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    if (shouldRefreshToken(token)) {
      // Refresh immediately if token is close to expiration
      refreshTokenInternal();
    } else {
      // Schedule refresh for later
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp) {
        const timeUntilRefresh = (decoded.exp * 1000) - Date.now() - TOKEN_REFRESH_THRESHOLD;
        if (timeUntilRefresh > 0) {
          refreshTimeoutRef.current = setTimeout(() => {
            refreshTokenInternal();
          }, timeUntilRefresh);
        }
      }
    }
  }, []);

  // Internal refresh token function
  const refreshTokenInternal = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const authResponse: AuthResponse = await response.json();
      
      storeAuthData(authResponse);
      setAuthState({
        user: authResponse.user,
        token: authResponse.token,
        isAuthenticated: true,
        isLoading: false,
      });

      scheduleTokenRefresh(authResponse.token);
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearAuthData();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [storeAuthData, clearAuthData, scheduleTokenRefresh]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Login failed';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const authResponse: AuthResponse = await response.json();
      
      storeAuthData(authResponse);
      setAuthState({
        user: authResponse.user,
        token: authResponse.token,
        isAuthenticated: true,
        isLoading: false,
      });

      scheduleTokenRefresh(authResponse.token);
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [storeAuthData, scheduleTokenRefresh]);

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Registration failed';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const authResponse: AuthResponse = await response.json();
      
      storeAuthData(authResponse);
      setAuthState({
        user: authResponse.user,
        token: authResponse.token,
        isAuthenticated: true,
        isLoading: false,
      });

      scheduleTokenRefresh(authResponse.token);
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [storeAuthData, scheduleTokenRefresh]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // Notify server about logout (optional)
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Ignore logout API errors - still clear local data
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearAuthData();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [clearAuthData]);

  // Public refresh token function
  const refreshToken = useCallback(async () => {
    await refreshTokenInternal();
  }, [refreshTokenInternal]);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setAuthState(prev => ({ ...prev, isAuthenticated: false, isLoading: false }));
        return;
      }

      if (isTokenExpired(token)) {
        await refreshTokenInternal();
        return;
      }

      // Verify token with server
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const userData = await response.json();
      const storedUser = localStorage.getItem(USER_KEY);
      const user = storedUser ? JSON.parse(storedUser) : userData.user;

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      scheduleTokenRefresh(token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      clearAuthData();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [refreshTokenInternal, clearAuthData, scheduleTokenRefresh]);

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout,
    refreshToken,
    checkAuthStatus,
  };
};