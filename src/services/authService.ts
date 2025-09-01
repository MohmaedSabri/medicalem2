import axiosClient from '../config/axiosClient';
import { endpoints } from '../config/endpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosClient.post(endpoints.USERS_LOGIN, credentials);
    return response.data;
  },

  // Logout (client-side only)
  logout: async (): Promise<void> => {
    // Clear the token from cookies
    document.cookie = 'authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
  },
};
