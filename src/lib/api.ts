import axios from 'axios';
import type { AuthResponse, User, MigrationJob, MigrationJobDetail, NovaTabConfig } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    company?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Migration API
export const migrationApi = {
  createJob: async (data: {
    name: string;
    sourceType: string;
    sourceData: any[];
    destinationConfig: {
      type: string;
      endpoint?: string;
      apiKey?: string;
    };
    mappingConfig: Record<string, string>;
  }) => {
    const response = await api.post('/migration/jobs', data);
    return response.data;
  },

  getJobs: async (): Promise<MigrationJob[]> => {
    const response = await api.get('/migration/jobs');
    return response.data;
  },

  getJob: async (id: string): Promise<MigrationJobDetail> => {
    const response = await api.get(`/migration/jobs/${id}`);
    return response.data;
  },

  executeJob: async (id: string) => {
    const response = await api.post(`/migration/jobs/${id}/execute`);
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`/migration/jobs/${id}`);
    return response.data;
  },
};

// NovaTab API
export const novatabApi = {
  createConfig: async (data: {
    configName: string;
    apiEndpoint: string;
    apiKey: string;
    fieldMappings: Record<string, string>;
  }) => {
    const response = await api.post('/novatab/configs', data);
    return response.data;
  },

  getConfigs: async (): Promise<NovaTabConfig[]> => {
    const response = await api.get('/novatab/configs');
    return response.data;
  },

  getConfig: async (id: string): Promise<NovaTabConfig> => {
    const response = await api.get(`/novatab/configs/${id}`);
    return response.data;
  },

  updateConfig: async (id: string, data: Partial<NovaTabConfig>) => {
    const response = await api.put(`/novatab/configs/${id}`, data);
    return response.data;
  },

  deleteConfig: async (id: string) => {
    const response = await api.delete(`/novatab/configs/${id}`);
    return response.data;
  },

  testConnection: async (id: string) => {
    const response = await api.post(`/novatab/configs/${id}/test`);
    return response.data;
  },
};

export default api;

