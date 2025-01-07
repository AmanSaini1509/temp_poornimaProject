import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the backend
const BASE_URL = 'http://192.168.80.231:3000/api';

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login API
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data; // { token, role }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Fetch meetings based on filters
export const getMeetings = async (filter) => {
  try {
    const response = await api.get(`/meetings/meetings`, { params: { status: filter } });
    return response.data; // Array of meetings
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || 'Failed to fetch meetings');
  }
};

// Fetch messages
export const getMessages = async (userId) => {
  try {
    const response = await api.get('/messages/messages', {
      params: { sentTo: userId } // Pass user ID for filtering
    });
    return response.data; // Array of messages
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};

// Logout API
export const logout = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId'); // Fetch user ID from storage
    if (!userId) throw new Error('User ID not found');

    // Call the backend logout API
    const response = await api.post('/auth/logout', { userId });

    if (response.status === 200) {
      await AsyncStorage.removeItem('authToken'); // Clear auth token
      await AsyncStorage.removeItem('userId');    // Clear user ID
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error.message);
    Alert.alert('Error', error.message);
  }
};
