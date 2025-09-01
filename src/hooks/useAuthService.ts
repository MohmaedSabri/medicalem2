import { useCallback } from 'react';
import { authService, LoginCredentials } from '../services/authService';
import { toast } from 'react-hot-toast';

export const useAuthService = () => {
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      return { success: true };
    } catch {
      // Logout error
      toast.error('Logout failed. Please try again.');
      return { success: false, error: 'Logout failed' };
    }
  }, []);

  return {
    login,
    logout,
  };
};
