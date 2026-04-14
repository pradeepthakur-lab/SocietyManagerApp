import api from './api';

export const societyService = {
  getSociety: async () => {
    return api.get('/society');
  },

  updateSociety: async (updates) => {
    return api.put('/society', updates);
  },

  updateInterestRate: async (arrearsInterestRate) => {
    return api.put('/society/interest-rate', { arrearsInterestRate });
  },

  getBuildings: async () => {
    return api.get('/buildings');
  },

  addBuilding: async (building) => {
    return api.post('/buildings', building);
  },

  getFlats: async () => {
    return api.get('/flats');
  },

  addFlat: async (flat) => {
    return api.post('/flats', flat);
  },

  updateFlat: async (flatId, updates) => {
    return api.put(`/flats/${flatId}`, updates);
  },

  deleteFlat: async (flatId) => {
    return api.del(`/flats/${flatId}`);
  },

  getResidents: async () => {
    return api.get('/residents');
  },

  addResident: async (resident) => {
    return api.post('/residents', resident);
  },

  updateResident: async (residentId, updates) => {
    return api.put(`/residents/${residentId}`, updates);
  },
};

export default societyService;
