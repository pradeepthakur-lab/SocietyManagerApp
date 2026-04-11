import api from './api';
import mockData from './mockData';

export const notificationService = {
  getNotifications: async (userId) => {
    const notifications = mockData.notifications.filter(
      (n) => n.userId === userId,
    );
    return api.mockResponse(notifications);
  },

  markAsRead: async (notificationId) => {
    const notification = mockData.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
    }
    return api.mockResponse(notification);
  },

  markAllAsRead: async (userId) => {
    mockData.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    return api.mockResponse(null);
  },

  addNotification: async (notification) => {
    const newNotification = {
      id: 'notif' + (mockData.notifications.length + 1),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    mockData.notifications.unshift(newNotification);
    return api.mockResponse(newNotification);
  },

  getUnreadCount: async (userId) => {
    const count = mockData.notifications.filter(
      (n) => n.userId === userId && !n.read,
    ).length;
    return api.mockResponse(count);
  },

  // Notices (admin announcements)
  getNotices: async () => {
    return api.mockResponse(mockData.notices);
  },

  addNotice: async (notice) => {
    const newNotice = {
      id: 'n' + (mockData.notices.length + 1),
      createdAt: new Date().toISOString(),
      createdBy: 'u1',
      ...notice,
    };
    mockData.notices.unshift(newNotice);
    return api.mockResponse(newNotice);
  },

  // Complaints
  getComplaints: async (userId) => {
    let complaints = [...mockData.complaints];
    if (userId) {
      complaints = complaints.filter((c) => c.userId === userId);
    }
    return api.mockResponse(complaints);
  },

  addComplaint: async (complaint) => {
    const newComplaint = {
      id: 'comp' + (mockData.complaints.length + 1),
      status: 'open',
      image: null,
      adminResponse: null,
      createdAt: new Date().toISOString(),
      ...complaint,
    };
    mockData.complaints.unshift(newComplaint);
    return api.mockResponse(newComplaint);
  },

  updateComplaintStatus: async (complaintId, status, response) => {
    const complaint = mockData.complaints.find((c) => c.id === complaintId);
    if (complaint) {
      complaint.status = status;
      if (response) {
        complaint.adminResponse = response;
      }
    }
    return api.mockResponse(complaint);
  },
};

export default notificationService;
