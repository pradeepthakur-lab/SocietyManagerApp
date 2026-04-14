import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, type, key: Date.now() });
    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
