import api from './api';

export const paymentService = {
  getPayments: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.status) params.append('status', filters.status);
    if (filters.billId) params.append('billId', filters.billId);
    const qs = params.toString();
    return api.get(`/payments${qs ? '?' + qs : ''}`);
  },

  getPaymentById: async (paymentId) => {
    return api.get(`/payments/${paymentId}`);
  },

  submitPayment: async (paymentData) => {
    return api.post('/payments', paymentData);
  },

  approvePayment: async (paymentId, adminId, comment) => {
    return api.put(`/payments/${paymentId}/approve`, { comment });
  },

  rejectPayment: async (paymentId, adminId, comment) => {
    return api.put(`/payments/${paymentId}/reject`, { comment });
  },
};

export default paymentService;
