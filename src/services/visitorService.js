import api from './api';

export const visitorService = {
  getVisitors: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.flat) params.append('flat', filters.flat);
    if (filters.date) params.append('date', filters.date);
    const qs = params.toString();
    return api.get(`/visitors${qs ? '?' + qs : ''}`);
  },

  getActiveVisitors: async () => {
    return api.get('/visitors?status=checked_in');
  },

  getVisitorById: async (visitorId) => {
    return api.get(`/visitors/${visitorId}`);
  },

  addVisitor: async (visitor) => {
    return api.post('/visitors', visitor);
  },

  checkoutVisitor: async (visitorId) => {
    return api.put(`/visitors/${visitorId}/checkout`);
  },

  getVisitorsByFlat: async (flatNumber) => {
    return api.get(`/visitors?flat=${flatNumber}`);
  },

  getTodayCount: async () => {
    return api.get('/visitors/count/today');
  },
};

export default visitorService;
