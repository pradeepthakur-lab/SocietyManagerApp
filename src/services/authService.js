import api from './api';
import mockData from './mockData';

// Maps role to default mock user ID
const ROLE_USER_MAP = {
  admin: 'u1',
  resident: 'u2',
  tenant: 'u5',
  manager: 'u6',
  security: 'u7',
};

export const authService = {
  login: async (mobile, role) => {
    // Mock: find user by mobile
    const user = mockData.users.find(
      (u) => u.mobile === mobile && u.role === role,
    );

    if (user) {
      return api.mockResponse({ userId: user.id, mobile });
    }

    // For demo, allow any number — map to role default
    const userId = ROLE_USER_MAP[role] || 'u2';
    return api.mockResponse({ userId, mobile });
  },

  verifyOTP: async (mobile, otp, role) => {
    // Mock: any 4-digit OTP works
    if (otp.length !== 4) {
      return api.mockError('Invalid OTP');
    }

    const userId = ROLE_USER_MAP[role] || 'u2';
    const user = mockData.users.find((u) => u.id === userId) || mockData.users[0];

    return api.mockResponse({
      user: { ...user, role },
      token: 'mock-jwt-token-' + Date.now(),
    });
  },

  logout: async () => {
    return api.mockResponse(null, 200);
  },

  getProfile: async (userId) => {
    const user = mockData.users.find((u) => u.id === userId);
    return api.mockResponse(user);
  },

  updateProfile: async (userId, updates) => {
    const user = mockData.users.find((u) => u.id === userId);
    if (user) {
      Object.assign(user, updates);
    }
    return api.mockResponse(user);
  },

  updateBankingDetails: async (userId, bankingDetails) => {
    const user = mockData.users.find((u) => u.id === userId);
    if (user) {
      user.bankingDetails = bankingDetails;
    }
    return api.mockResponse(user);
  },

  getBankingDetails: async (userId) => {
    const user = mockData.users.find((u) => u.id === userId);
    return api.mockResponse(user?.bankingDetails || null);
  },
};

export default authService;
