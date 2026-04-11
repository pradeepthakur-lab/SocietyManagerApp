import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH: '@society_auth',
  SOCIETY: '@society_data',
  BILLS: '@society_bills',
  PAYMENTS: '@society_payments',
  NOTIFICATIONS: '@society_notifications',
  RESIDENTS: '@society_residents',
  FLATS: '@society_flats',
  EXPENSES: '@society_expenses',
  COMPLAINTS: '@society_complaints',
  NOTICES: '@society_notices',
  SETTINGS: '@society_settings',
};

export const storage = {
  get: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  set: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },

  multiGet: async (keys) => {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result = {};
      pairs.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });
      return result;
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return {};
    }
  },
};

export { STORAGE_KEYS };
export default storage;
