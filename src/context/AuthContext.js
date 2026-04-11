import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';
import storage, { STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  loginPending: false,
  error: null,
};

const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_START: 'LOGIN_START',
  LOGIN_OTP_SENT: 'LOGIN_OTP_SENT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AUTH_ACTIONS.LOGIN_START:
      return { ...state, loginPending: true, error: null };
    case AUTH_ACTIONS.LOGIN_OTP_SENT:
      return { ...state, loginPending: false, error: null };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        loginPending: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loginPending: false,
        error: action.payload,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };
    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored auth on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedAuth = await storage.get(STORAGE_KEYS.AUTH);
        if (storedAuth && storedAuth.token) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: storedAuth,
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };
    loadStoredAuth();
  }, []);

  const login = async (mobile, role) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const result = await authService.login(mobile, role);
      if (result.success) {
        // Reset loginPending so OTP screen doesn't show a stale loader
        dispatch({ type: AUTH_ACTIONS.LOGIN_OTP_SENT });
        return result.data;
      }
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: 'Login failed' });
      return null;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.message });
      return null;
    }
  };

  const verifyOTP = async (mobile, otp, role) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const result = await authService.verifyOTP(mobile, otp, role);
      if (result.success) {
        const authData = {
          user: result.data.user,
          token: result.data.token,
        };
        await storage.set(STORAGE_KEYS.AUTH, authData);
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: authData });
        return true;
      }
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: result.error });
      return false;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.message });
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    await storage.remove(STORAGE_KEYS.AUTH);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateUser = (updates) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updates });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        verifyOTP,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
