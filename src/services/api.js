import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage key for custom host
const HOST_STORAGE_KEY = '@society_api_host';
const PORT_STORAGE_KEY = '@society_api_port';
const SELECTED_SOCIETY_CODE_KEY = '@society_selected_code';

// Defaults
// const DEFAULT_HOST = Platform.OS === 'android' ? '192.168.7.11' : 'localhost';
const DEFAULT_HOST = Platform.OS === 'android' ? '192.168.7.6' : 'localhost';
const DEFAULT_PORT = '3000';

// Cached values (loaded once, updated on save)
let cachedHost = null;
let cachedPort = null;

const getApiBaseUrl = async () => {
  if (cachedHost === null) {
    const savedHost = await AsyncStorage.getItem(HOST_STORAGE_KEY);
    const savedPort = await AsyncStorage.getItem(PORT_STORAGE_KEY);
    cachedHost = savedHost || DEFAULT_HOST;
    cachedPort = savedPort || DEFAULT_PORT;
  }
  return `http://${cachedHost}:${cachedPort}/api`;
};

// Called from ServerSettings screen to persist and update cache
const setApiHost = async (host, port) => {
  await AsyncStorage.setItem(HOST_STORAGE_KEY, host);
  await AsyncStorage.setItem(PORT_STORAGE_KEY, port || DEFAULT_PORT);
  cachedHost = host;
  cachedPort = port || DEFAULT_PORT;
};

const getApiHost = async () => {
  const savedHost = await AsyncStorage.getItem(HOST_STORAGE_KEY);
  const savedPort = await AsyncStorage.getItem(PORT_STORAGE_KEY);
  return {
    host: savedHost || DEFAULT_HOST,
    port: savedPort || DEFAULT_PORT,
  };
};

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

const setSelectedSocietyCode = async (code) => {
  if (code) {
    await AsyncStorage.setItem(
      SELECTED_SOCIETY_CODE_KEY,
      String(code).trim().toUpperCase()
    );
  } else {
    await AsyncStorage.removeItem(SELECTED_SOCIETY_CODE_KEY);
  }
};

const getSelectedSocietyCode = async () => {
  return AsyncStorage.getItem(SELECTED_SOCIETY_CODE_KEY);
};

const request = async (method, path, body = null, skipAuth = false) => {
  try {
    const headers = { 'Content-Type': 'application/json' };

    if (!skipAuth) {
      const token = await getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const selectedSocietyCode = await getSelectedSocietyCode();
      if (selectedSocietyCode) {
        headers['X-Society-Code'] = selectedSocietyCode;
      }
    }

    const config = { method, headers };
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const baseUrl = await getApiBaseUrl();
    const url = `${baseUrl}${path}`;
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
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
  // Allow skipping auth for login/otp endpoints
  postPublic: (path, body) => request('POST', path, body, true),
  // Host management
  setApiHost,
  getApiHost,
  setSelectedSocietyCode,
  getSelectedSocietyCode,
};

export default api;
