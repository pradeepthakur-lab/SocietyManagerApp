import api from './api';

export const vehicleService = {
  getVehicles: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.flatId) params.append('flatId', filters.flatId);
    if (filters.residentId) params.append('residentId', filters.residentId);
    if (filters.type) params.append('type', filters.type);
    const qs = params.toString();
    return api.get(`/vehicles${qs ? '?' + qs : ''}`);
  },

  getVehicleById: async (vehicleId) => {
    return api.get(`/vehicles/${vehicleId}`);
  },

  addVehicle: async (vehicle) => {
    return api.post('/vehicles', vehicle);
  },

  updateVehicle: async (vehicleId, updates) => {
    return api.put(`/vehicles/${vehicleId}`, updates);
  },

  removeVehicle: async (vehicleId) => {
    return api.del(`/vehicles/${vehicleId}`);
  },

  getVehiclesByFlat: async (flatId) => {
    return api.get(`/vehicles?flatId=${flatId}`);
  },

  getVehicleStats: async () => {
    return api.get('/vehicles/stats');
  },
};

export default vehicleService;
