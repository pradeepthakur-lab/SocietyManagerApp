import api from './api';
import mockData from './mockData';

export const vehicleService = {
  getVehicles: async (filters = {}) => {
    let vehicles = [...mockData.vehicles];

    if (filters.flatId) {
      vehicles = vehicles.filter((v) => v.flatId === filters.flatId);
    }
    if (filters.residentId) {
      vehicles = vehicles.filter((v) => v.residentId === filters.residentId);
    }
    if (filters.type) {
      vehicles = vehicles.filter((v) => v.type === filters.type);
    }

    return api.mockResponse(vehicles);
  },

  getVehicleById: async (vehicleId) => {
    const vehicle = mockData.vehicles.find((v) => v.id === vehicleId);
    return api.mockResponse(vehicle);
  },

  addVehicle: async (vehicle) => {
    const newVehicle = {
      id: 'v' + (mockData.vehicles.length + 1),
      ...vehicle,
    };
    mockData.vehicles.push(newVehicle);
    return api.mockResponse(newVehicle);
  },

  updateVehicle: async (vehicleId, updates) => {
    const vehicle = mockData.vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      Object.assign(vehicle, updates);
    }
    return api.mockResponse(vehicle);
  },

  removeVehicle: async (vehicleId) => {
    const index = mockData.vehicles.findIndex((v) => v.id === vehicleId);
    if (index > -1) {
      mockData.vehicles.splice(index, 1);
    }
    return api.mockResponse(null);
  },

  getVehiclesByFlat: async (flatId) => {
    const vehicles = mockData.vehicles.filter((v) => v.flatId === flatId);
    return api.mockResponse(vehicles);
  },

  getVehicleStats: async () => {
    const total = mockData.vehicles.length;
    const twoWheelers = mockData.vehicles.filter(
      (v) => v.type === 'two_wheeler',
    ).length;
    const fourWheelers = mockData.vehicles.filter(
      (v) => v.type === 'four_wheeler',
    ).length;
    const totalMonthlyCharges = mockData.vehicles.reduce(
      (sum, v) => sum + v.monthlyCharge,
      0,
    );
    return api.mockResponse({
      total,
      twoWheelers,
      fourWheelers,
      totalMonthlyCharges,
    });
  },
};

export default vehicleService;
