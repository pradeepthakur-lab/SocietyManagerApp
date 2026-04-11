import React, { createContext, useContext, useReducer } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext(null);

const initialState = {
  notifications: [],
  notices: [],
  complaints: [],
  unreadCount: 0,
  loading: false,
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  SET_NOTICES: 'SET_NOTICES',
  SET_COMPLAINTS: 'SET_COMPLAINTS',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  ADD_NOTICE: 'ADD_NOTICE',
  ADD_COMPLAINT: 'ADD_COMPLAINT',
  MARK_READ: 'MARK_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
  UPDATE_COMPLAINT: 'UPDATE_COMPLAINT',
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
        loading: false,
      };
    case ACTIONS.SET_NOTICES:
      return { ...state, notices: action.payload, loading: false };
    case ACTIONS.SET_COMPLAINTS:
      return { ...state, complaints: action.payload, loading: false };
    case ACTIONS.ADD_NOTICE:
      return { ...state, notices: [action.payload, ...state.notices] };
    case ACTIONS.ADD_COMPLAINT:
      return { ...state, complaints: [action.payload, ...state.complaints] };
    case ACTIONS.MARK_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case ACTIONS.MARK_ALL_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };
    case ACTIONS.UPDATE_COMPLAINT:
      return {
        ...state,
        complaints: state.complaints.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c,
        ),
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const loadNotifications = async (userId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await notificationService.getNotifications(userId);
    if (result.success) {
      dispatch({ type: ACTIONS.SET_NOTIFICATIONS, payload: result.data });
    }
  };

  const loadNotices = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await notificationService.getNotices();
    if (result.success) {
      dispatch({ type: ACTIONS.SET_NOTICES, payload: result.data });
    }
  };

  const loadComplaints = async (userId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await notificationService.getComplaints(userId);
    if (result.success) {
      dispatch({ type: ACTIONS.SET_COMPLAINTS, payload: result.data });
    }
  };

  const markAsRead = async (notificationId) => {
    const result = await notificationService.markAsRead(notificationId);
    if (result.success) {
      dispatch({ type: ACTIONS.MARK_READ, payload: notificationId });
    }
  };

  const markAllAsRead = async (userId) => {
    const result = await notificationService.markAllAsRead(userId);
    if (result.success) {
      dispatch({ type: ACTIONS.MARK_ALL_READ });
    }
  };

  const addNotice = async (notice) => {
    const result = await notificationService.addNotice(notice);
    if (result.success) {
      dispatch({ type: ACTIONS.ADD_NOTICE, payload: result.data });
      return true;
    }
    return false;
  };

  const addComplaint = async (complaint) => {
    const result = await notificationService.addComplaint(complaint);
    if (result.success) {
      dispatch({ type: ACTIONS.ADD_COMPLAINT, payload: result.data });
      return true;
    }
    return false;
  };

  const updateComplaintStatus = async (complaintId, status, response) => {
    const result = await notificationService.updateComplaintStatus(
      complaintId,
      status,
      response,
    );
    if (result.success) {
      dispatch({ type: ACTIONS.UPDATE_COMPLAINT, payload: result.data });
      return true;
    }
    return false;
  };

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        loadNotifications,
        loadNotices,
        loadComplaints,
        markAsRead,
        markAllAsRead,
        addNotice,
        addComplaint,
        updateComplaintStatus,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
};

export default NotificationContext;
