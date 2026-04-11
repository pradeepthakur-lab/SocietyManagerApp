import React, { createContext, useContext, useReducer } from 'react';
import billingService from '../services/billingService';
import paymentService from '../services/paymentService';

const BillingContext = createContext(null);

const initialState = {
  bills: [],
  payments: [],
  charges: [],
  expenses: [],
  reportData: null,
  loading: false,
  error: null,
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BILLS: 'SET_BILLS',
  SET_PAYMENTS: 'SET_PAYMENTS',
  SET_CHARGES: 'SET_CHARGES',
  SET_EXPENSES: 'SET_EXPENSES',
  SET_REPORT_DATA: 'SET_REPORT_DATA',
  ADD_BILLS: 'ADD_BILLS',
  ADD_PAYMENT: 'ADD_PAYMENT',
  UPDATE_PAYMENT: 'UPDATE_PAYMENT',
  UPDATE_BILL: 'UPDATE_BILL',
  ADD_EXPENSE: 'ADD_EXPENSE',
};

const billingReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_BILLS:
      return { ...state, bills: action.payload, loading: false };
    case ACTIONS.SET_PAYMENTS:
      return { ...state, payments: action.payload, loading: false };
    case ACTIONS.SET_CHARGES:
      return { ...state, charges: action.payload };
    case ACTIONS.SET_EXPENSES:
      return { ...state, expenses: action.payload, loading: false };
    case ACTIONS.SET_REPORT_DATA:
      return { ...state, reportData: action.payload, loading: false };
    case ACTIONS.ADD_BILLS:
      return { ...state, bills: [...state.bills, ...action.payload] };
    case ACTIONS.ADD_PAYMENT:
      return { ...state, payments: [...state.payments, action.payload] };
    case ACTIONS.UPDATE_PAYMENT:
      return {
        ...state,
        payments: state.payments.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      };
    case ACTIONS.UPDATE_BILL:
      return {
        ...state,
        bills: state.bills.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b,
        ),
      };
    case ACTIONS.ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };
    default:
      return state;
  }
};

export const BillingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(billingReducer, initialState);

  const loadBills = async (filters) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await billingService.getBills(filters);
    if (result.success) {
      dispatch({ type: ACTIONS.SET_BILLS, payload: result.data });
    }
  };

  const loadPayments = async (filters) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await paymentService.getPayments(filters);
    if (result.success) {
      dispatch({ type: ACTIONS.SET_PAYMENTS, payload: result.data });
    }
  };

  const loadCharges = async () => {
    const result = await billingService.getCharges();
    if (result.success) {
      dispatch({ type: ACTIONS.SET_CHARGES, payload: result.data });
    }
  };

  const loadExpenses = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await billingService.getExpenses();
    if (result.success) {
      dispatch({ type: ACTIONS.SET_EXPENSES, payload: result.data });
    }
  };

  const loadReportData = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await billingService.getReportData();
    if (result.success) {
      dispatch({ type: ACTIONS.SET_REPORT_DATA, payload: result.data });
    }
  };

  const generateBills = async (month, year, charges) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await billingService.generateBills(month, year, charges);
    if (result.success) {
      dispatch({ type: ACTIONS.ADD_BILLS, payload: result.data });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return result.data;
    }
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    return null;
  };

  const submitPayment = async (paymentData) => {
    const result = await paymentService.submitPayment(paymentData);
    if (result.success) {
      dispatch({ type: ACTIONS.ADD_PAYMENT, payload: result.data });
      // Update bill status
      dispatch({
        type: ACTIONS.UPDATE_BILL,
        payload: { id: paymentData.billId, status: 'pending_verification' },
      });
      return true;
    }
    return false;
  };

  const approvePayment = async (paymentId, adminId, comment) => {
    const result = await paymentService.approvePayment(paymentId, adminId, comment);
    if (result.success) {
      dispatch({ type: ACTIONS.UPDATE_PAYMENT, payload: result.data });
      // Update bill status
      dispatch({
        type: ACTIONS.UPDATE_BILL,
        payload: { id: result.data.billId, status: 'paid' },
      });
      return true;
    }
    return false;
  };

  const rejectPayment = async (paymentId, adminId, comment) => {
    const result = await paymentService.rejectPayment(paymentId, adminId, comment);
    if (result.success) {
      dispatch({ type: ACTIONS.UPDATE_PAYMENT, payload: result.data });
      dispatch({
        type: ACTIONS.UPDATE_BILL,
        payload: { id: result.data.billId, status: 'unpaid' },
      });
      return true;
    }
    return false;
  };

  const addExpense = async (expense) => {
    const result = await billingService.addExpense(expense);
    if (result.success) {
      dispatch({ type: ACTIONS.ADD_EXPENSE, payload: result.data });
      return true;
    }
    return false;
  };

  return (
    <BillingContext.Provider
      value={{
        ...state,
        loadBills,
        loadPayments,
        loadCharges,
        loadExpenses,
        loadReportData,
        generateBills,
        submitPayment,
        approvePayment,
        rejectPayment,
        addExpense,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

export default BillingContext;
