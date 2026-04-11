import api from './api';
import mockData from './mockData';

export const societyService = {
  getSociety: async () => {
    return api.mockResponse(mockData.society);
  },

  updateSociety: async (updates) => {
    Object.assign(mockData.society, updates);
    return api.mockResponse(mockData.society);
  },

  getBuildings: async () => {
    return api.mockResponse(mockData.buildings);
  },

  addBuilding: async (building) => {
    const newBuilding = {
      id: 'b' + (mockData.buildings.length + 1),
      societyId: 's1',
      ...building,
    };
    mockData.buildings.push(newBuilding);
    return api.mockResponse(newBuilding);
  },

  getFlats: async () => {
    return api.mockResponse(mockData.flats);
  },

  addFlat: async (flat) => {
    const newFlat = {
      id: 'f' + (mockData.flats.length + 1),
      societyId: 's1',
      residentId: null,
      status: 'vacant',
      ...flat,
    };
    mockData.flats.push(newFlat);
    return api.mockResponse(newFlat);
  },

  updateFlat: async (flatId, updates) => {
    const flat = mockData.flats.find((f) => f.id === flatId);
    if (flat) {
      Object.assign(flat, updates);
    }
    return api.mockResponse(flat);
  },

  deleteFlat: async (flatId) => {
    const index = mockData.flats.findIndex((f) => f.id === flatId);
    if (index > -1) {
      mockData.flats.splice(index, 1);
    }
    return api.mockResponse(null);
  },

  getResidents: async () => {
    const residents = mockData.users.filter(
      (u) => u.role === 'resident' || u.role === 'tenant',
    );
    return api.mockResponse(residents);
  },

  addResident: async (resident) => {
    const newResident = {
      id: 'u' + (mockData.users.length + 1),
      societyId: 's1',
      avatar: null,
      ...resident,
    };
    mockData.users.push(newResident);

    // Update flat status
    if (resident.flatId) {
      const flat = mockData.flats.find((f) => f.id === resident.flatId);
      if (flat) {
        flat.residentId = newResident.id;
        flat.status = 'occupied';
      }
    }

    return api.mockResponse(newResident);
  },

  updateResident: async (residentId, updates) => {
    const resident = mockData.users.find((u) => u.id === residentId);
    if (resident) {
      Object.assign(resident, updates);
    }
    return api.mockResponse(resident);
  },
};

export default societyService;
