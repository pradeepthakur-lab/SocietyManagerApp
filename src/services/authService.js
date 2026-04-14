import api from './api';

export const authService = {
  login: async (mobile, role) => {
    return api.postPublic('/auth/login', { mobile, role });
  },

  verifyOTP: async (mobile, otp, role) => {
    return api.postPublic('/auth/verify-otp', { mobile, otp, role });
  },

  logout: async () => {
    return { success: true, data: null };
  },

  getProfile: async () => {
    return api.get('/auth/profile');
  },

  updateProfile: async (userId, updates) => {
    return api.put('/auth/profile', updates);
  },

  updateBankingDetails: async (userId, bankingDetails) => {
    return api.put('/auth/banking-details', bankingDetails);
  },

  getBankingDetails: async () => {
    return api.get('/auth/banking-details');
  },
};

export default authService;
