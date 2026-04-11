import api from './api';
import mockData from './mockData';

export const visitorService = {
  getVisitors: async (filters = {}) => {
    let visitors = [...mockData.visitors];

    if (filters.status) {
      visitors = visitors.filter((v) => v.status === filters.status);
    }
    if (filters.flat) {
      visitors = visitors.filter((v) => v.visitingFlat === filters.flat);
    }
    if (filters.date) {
      visitors = visitors.filter((v) =>
        v.checkedInAt.startsWith(filters.date),
      );
    }

    // Sort: active first, then by check-in time descending
    visitors.sort((a, b) => {
      if (a.status === 'checked_in' && b.status !== 'checked_in') return -1;
      if (a.status !== 'checked_in' && b.status === 'checked_in') return 1;
      return new Date(b.checkedInAt) - new Date(a.checkedInAt);
    });

    return api.mockResponse(visitors);
  },

  getActiveVisitors: async () => {
    const visitors = mockData.visitors.filter(
      (v) => v.status === 'checked_in',
    );
    return api.mockResponse(visitors);
  },

  getVisitorById: async (visitorId) => {
    const visitor = mockData.visitors.find((v) => v.id === visitorId);
    return api.mockResponse(visitor);
  },

  addVisitor: async (visitor) => {
    const newVisitor = {
      id: 'vis' + (mockData.visitors.length + 1),
      checkedInAt: new Date().toISOString(),
      checkedOutAt: null,
      status: 'checked_in',
      ...visitor,
    };
    mockData.visitors.unshift(newVisitor);
    return api.mockResponse(newVisitor);
  },

  checkoutVisitor: async (visitorId) => {
    const visitor = mockData.visitors.find((v) => v.id === visitorId);
    if (visitor) {
      visitor.status = 'checked_out';
      visitor.checkedOutAt = new Date().toISOString();
    }
    return api.mockResponse(visitor);
  },

  getVisitorsByFlat: async (flatNumber) => {
    const visitors = mockData.visitors.filter(
      (v) => v.visitingFlat === flatNumber,
    );
    return api.mockResponse(visitors);
  },

  getTodayCount: async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = mockData.visitors.filter((v) =>
      v.checkedInAt.startsWith(today),
    );
    const active = mockData.visitors.filter(
      (v) => v.status === 'checked_in',
    );
    return api.mockResponse({
      today: todayVisitors.length,
      active: active.length,
    });
  },
};

export default visitorService;
