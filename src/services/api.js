// Centralised API config — swap mock with real endpoints here
const API_BASE_URL = 'https://api.example.com/v1'; // Replace with real URL

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const api = {
  baseUrl: API_BASE_URL,

  // Simulates network delay for mock responses
  delay,

  // Helper to simulate API call
  mockResponse: async (data, ms = 400) => {
    await delay(ms);
    return { success: true, data };
  },

  mockError: async (message, ms = 300) => {
    await delay(ms);
    return { success: false, error: message };
  },
};

export default api;
