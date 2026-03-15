import { createContext, useContext, useState, useCallback } from 'react';
import { currentUser } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = useCallback((email, password) => {
    // Mock login
    setUser(currentUser);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback((data) => {
    // Mock register
    const newUser = { ...currentUser, name: `${data.firstName} ${data.lastName}`, email: data.email, phone: data.phone };
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
