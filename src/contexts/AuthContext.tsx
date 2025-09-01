/** @format */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if token exists in cookies
      const token = getCookie('authToken');
      
      if (token) {
        // Token exists, consider user authenticated
        // You can add additional validation here if needed
        // For now, we'll set a basic user object or you can store user data in localStorage/cookies
        setUser({ id: '1', name: 'User', email: 'user@example.com' }); // Placeholder user data
        setIsLoading(false);
      } else {
        // No token, user not authenticated
        setUser(null);
        setIsLoading(false);
      }
    } catch (error: any) {
      // Handle any errors
      removeCookie('authToken');
      setUser(null);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://zaher-backend.vercel.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in cookie
        setCookie('authToken', data.token, 1); // 1 day expiry
        
        // Set user data
        setUser(data.user);
        
        toast.success('Login successful!');
        navigate('/dashboard');
        return true;
      } else {
        toast.error(data.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      // Handle specific error messages from API
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Network error. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove token from cookie
    removeCookie('authToken');
    
    // Clear user data
    setUser(null);
    
    // Navigate to home
    navigate('/');
    
    toast.success('Logged out successfully');
  };

  // Cookie utility functions
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const removeCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
