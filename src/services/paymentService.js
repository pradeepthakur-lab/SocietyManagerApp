import api from './api';
import mockData from './mockData';

export const paymentService = {
  getPayments: async (filters = {}) => {
    let payments = [...mockData.payments];

    if (filters.userId) {
      payments = payments.filter((p) => p.userId === filters.userId);
    }
    if (filters.status) {
      payments = payments.filter((p) => p.status === filters.status);
    }
    if (filters.billId) {
      payments = payments.filter((p) => p.billId === filters.billId);
    }

    return api.mockResponse(payments);
  },

  getPaymentById: async (paymentId) => {
    const payment = mockData.payments.find((p) => p.id === paymentId);
    return api.mockResponse(payment);
  },

  submitPayment: async (paymentData) => {
    const newPayment = {
      id: 'pay' + (mockData.payments.length + 1),
      status: 'pending_verification',
      submittedAt: new Date().toISOString(),
      verifiedBy: null,
      verifiedAt: null,
      comment: null,
      ...paymentData,
    };

    mockData.payments.push(newPayment);

    // Update bill status
    const bill = mockData.bills.find((b) => b.id === paymentData.billId);
    if (bill) {
      bill.status = 'pending_verification';
    }

    return api.mockResponse(newPayment);
  },

  approvePayment: async (paymentId, adminId, comment) => {
    const payment = mockData.payments.find((p) => p.id === paymentId);
    if (payment) {
      payment.status = 'approved';
      payment.verifiedBy = adminId;
      payment.verifiedAt = new Date().toISOString();
      payment.comment = comment || 'Payment verified and approved';

      // Update bill status
      const bill = mockData.bills.find((b) => b.id === payment.billId);
      if (bill) {
        bill.status = 'paid';
      }
    }
    return api.mockResponse(payment);
  },

  rejectPayment: async (paymentId, adminId, comment) => {
    const payment = mockData.payments.find((p) => p.id === paymentId);
    if (payment) {
      payment.status = 'rejected';
      payment.verifiedBy = adminId;
      payment.verifiedAt = new Date().toISOString();
      payment.comment = comment || 'Payment rejected';

      // Revert bill status
      const bill = mockData.bills.find((b) => b.id === payment.billId);
      if (bill) {
        bill.status = 'unpaid';
      }
    }
    return api.mockResponse(payment);
  },
};

export default paymentService;
