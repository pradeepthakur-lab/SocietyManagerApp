import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Android emulator → host machine uses 10.0.2.2
// iOS simulator → localhost works
// Physical device → replace with your machine's LAN IP (e.g., 192.168.1.100)
const MANUAL_IP = '192.168.7.6'; // Set this to your computer's IP for physical devices
const DEFAULT_HOST = MANUAL_IP || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const API_BASE_URL = `http://${DEFAULT_HOST}:3000/api`;

const getToken = async () => {
  try {
    const raw = await AsyncStorage.getItem('@society_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.token || null;
    }
  } catch (e) {
    console.warn('Failed to read auth token:', e);
  }
  return null;
};

const request = async (method, path, body = null, skipAuth = false) => {
  try {
    const headers = { 'Content-Type': 'application/json' };

    if (!skipAuth) {
      const token = await getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const config = { method, headers };
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, config);
    const json = await response.json();

    if (!response.ok) {
      return { success: false, error: json.error || `Request failed (${response.status})` };
    }

    return json; // Backend already returns { success: true, data }
  } catch (error) {
    console.error(`API ${method} ${path} error:`, error);
    return { success: false, error: error.message || 'Network error' };
  }
};

const api = {
  baseUrl: API_BASE_URL,
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
  // Allow skipping auth for login/otp endpoints
  postPublic: (path, body) => request('POST', path, body, true),
};

export default api;
