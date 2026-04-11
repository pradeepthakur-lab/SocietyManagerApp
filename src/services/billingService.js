import api from './api';
import mockData from './mockData';

export const billingService = {
  getCharges: async () => {
    return api.mockResponse(mockData.charges);
  },

  updateCharges: async (charges) => {
    mockData.charges = charges;
    return api.mockResponse(charges);
  },

  getBills: async (filters = {}) => {
    let bills = [...mockData.bills];

    if (filters.userId) {
      bills = bills.filter((b) => b.residentId === filters.userId);
    }
    if (filters.status) {
      bills = bills.filter((b) => b.status === filters.status);
    }
    if (filters.month !== undefined) {
      bills = bills.filter((b) => b.month === filters.month);
    }
    if (filters.year) {
      bills = bills.filter((b) => b.year === filters.year);
    }

    return api.mockResponse(bills);
  },

  getBillById: async (billId) => {
    const bill = mockData.bills.find((b) => b.id === billId);
    return api.mockResponse(bill);
  },

  generateBills: async (month, year, charges) => {
    const occupiedFlats = mockData.flats.filter((f) => f.status === 'occupied');
    const newBills = [];

    occupiedFlats.forEach((flat) => {
      const resident = mockData.users.find((u) => u.id === flat.residentId);
      const billCharges = charges.map((c) => ({ name: c.name, amount: c.amount }));
      const totalAmount = billCharges.reduce((sum, c) => sum + c.amount, 0);

      const bill = {
        id: 'bill' + (mockData.bills.length + newBills.length + 1),
        flatId: flat.id,
        flatNumber: flat.flatNumber,
        residentName: resident ? resident.name : 'Unknown',
        residentId: flat.residentId,
        month,
        year,
        charges: billCharges,
        totalAmount,
        dueDate: new Date(year, month + 1, 15).toISOString().split('T')[0],
        previousDue: 0,
        lateFee: 0,
        status: 'unpaid',
        createdAt: new Date().toISOString().split('T')[0],
      };

      newBills.push(bill);
    });

    mockData.bills.push(...newBills);
    return api.mockResponse(newBills);
  },

  getExpenses: async () => {
    return api.mockResponse(mockData.expenses);
  },

  addExpense: async (expense) => {
    const newExpense = {
      id: 'exp' + (mockData.expenses.length + 1),
      receipt: null,
      ...expense,
    };
    mockData.expenses.push(newExpense);
    return api.mockResponse(newExpense);
  },

  getReportData: async () => {
    const totalCollection = mockData.payments
      .filter((p) => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = mockData.bills
      .filter((b) => b.status === 'unpaid' || b.status === 'pending_verification')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalExpenses = mockData.expenses.reduce((sum, e) => sum + e.amount, 0);

    const defaulters = mockData.bills
      .filter((b) => b.status === 'unpaid')
      .map((b) => ({
        flatNumber: b.flatNumber,
        residentName: b.residentName,
        amount: b.totalAmount + b.lateFee,
        dueDate: b.dueDate,
      }));

    const monthlyData = [
      { month: 'Jan', collection: 42000, expenses: 35000 },
      { month: 'Feb', collection: 38000, expenses: 32000 },
      { month: 'Mar', collection: 8700, expenses: 60000 },
      { month: 'Apr', collection: 0, expenses: 0 },
    ];

    return api.mockResponse({
      totalCollection,
      pendingAmount,
      totalExpenses,
      totalFlats: mockData.flats.length,
      occupiedFlats: mockData.flats.filter((f) => f.status === 'occupied').length,
      defaulters,
      monthlyData,
    });
  },
};

export default billingService;
