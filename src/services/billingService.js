import api from './api';

export const billingService = {
  getCharges: async () => {
    return api.get('/charges');
  },

  updateCharges: async (charges) => {
    return api.put('/charges', { charges });
  },

  getBills: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.status) params.append('status', filters.status);
    if (filters.month !== undefined) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    const qs = params.toString();
    return api.get(`/bills${qs ? '?' + qs : ''}`);
  },

  getBillById: async (billId) => {
    return api.get(`/bills/${billId}`);
  },

  generateBills: async (month, year) => {
    return api.post('/bills/generate', { month, year });
  },

  getArrearsPreview: async (month, year) => {
    return api.get(`/bills/arrears-preview?month=${month}&year=${year}`);
  },

  getFlatArrears: async (flatId) => {
    return api.get(`/bills/arrears/${flatId}`);
  },

  getBillInvoice: async (billId) => {
    return api.get(`/bills/${billId}/invoice`);
  },

  getExpenses: async () => {
    return api.get('/expenses');
  },

  addExpense: async (expense) => {
    return api.post('/expenses', expense);
  },

  getReportData: async () => {
    return api.get('/reports');
  },
};

export default billingService;
