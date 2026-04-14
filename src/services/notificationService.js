import api from './api';

export const notificationService = {
  getNotifications: async () => {
    return api.get('/notifications');
  },

  markAsRead: async (notificationId) => {
    return api.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async () => {
    return api.put('/notifications/read-all');
  },

  getUnreadCount: async () => {
    return api.get('/notifications/unread-count');
  },

  // Notices (admin announcements)
  getNotices: async () => {
    return api.get('/notices');
  },

  addNotice: async (notice) => {
    return api.post('/notices', notice);
  },

  // Complaints
  getComplaints: async () => {
    return api.get('/complaints');
  },

  addComplaint: async (complaint) => {
    return api.post('/complaints', complaint);
  },

  updateComplaintStatus: async (complaintId, status, adminResponse) => {
    return api.put(`/complaints/${complaintId}/status`, { status, adminResponse });
  },
};

export default notificationService;
