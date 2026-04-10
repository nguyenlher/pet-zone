import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

// Mock user data (temporary until auth service is integrated)
const mockCurrentUser = {
  id: 1,
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 234 567 8900',
  avatar: 'https://i.pravatar.cc/200?img=1',
  address: '123 Pet Street, New York, NY 10001',
  joinDate: '2024-06-15',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(mockCurrentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = useCallback((email, password) => {
    // Mock login - will be replaced with actual API call
    setUser(mockCurrentUser);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback((data) => {
    // Mock register - will be replaced with actual API call
    const newUser = { 
      ...mockCurrentUser, 
      name: `${data.firstName} ${data.lastName}`, 
      email: data.email, 
      phone: data.phone 
    };
    setUser(newUser);
    setIsAuthenticated(true);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
