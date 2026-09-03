import api from './api';
import { User } from '../types';
import { mockUser } from '../data/mockData';

export const authService = {
  register: async (userData: Partial<User>) => {
    // try {
    //   const response = await api.post('/auth/register', userData);
    //   return response.data;
    // } catch (e) {
    //   console.error(e);
    // }
    return { success: true, message: 'Registered successfully' };
  },
  
  sendOtp: async (mobile: string) => {
    // return api.post('/auth/send-otp', { mobile });
    return { success: true, message: 'OTP sent' };
  },
  
  verifyOtp: async (mobile: string, otp: string) => {
    // const response = await api.post('/auth/verify-otp', { mobile, otp });
    // return response.data;
    if (otp === '123456') {
      return { success: true, token: 'mock-jwt-token', user: mockUser };
    }
    throw new Error('Invalid OTP');
  },
  
  login: async (mobile: string) => {
    return authService.sendOtp(mobile);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
