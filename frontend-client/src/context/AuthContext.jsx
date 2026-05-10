import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getAccessToken();
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired
          if (error.response?.status === 401) {
            // Try to refresh token
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              try {
                await authService.refreshToken();
                const userData = await authService.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
              } catch (refreshError) {
                // Refresh failed, clear tokens silently
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('token_type');
                localStorage.removeItem('expires_in');
                setUser(null);
                setIsAuthenticated(false);
              }
            } else {
              // No refresh token, clear everything
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('token_type');
              localStorage.removeItem('expires_in');
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            console.error('Failed to fetch user data:', error);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      // Call login API
      await authService.login(email, password);
      
      // Fetch user profile after successful login
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      // Call register API
      const response = await authService.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      });
      
      if (response.success) {
        // After successful registration, log the user in
        await login(data.email, data.password);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    }
  }, [login]);

  const updateProfile = useCallback(async (updates) => {
    try {
      // Call API to update profile on backend
      const updatedUser = await authService.updateProfile(updates);
      
      // Update local state with response from server
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
