import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeEmail = async (payload) => {
  const res = await client.post('/analyze', payload);
  return res.data;
};

export const analyzeEmailFile = async (formData) => {
  const res = await client.post('/analyze/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getIncidents = async (params = {}) => {
  const res = await client.get('/incidents', { params });
  return res.data;
};

export const getIncidentDetail = async (incidentId) => {
  const res = await client.get(`/incidents/${incidentId}`);
  return res.data;
};

export const updateIncidentStatus = async (incidentId, status) => {
  const res = await client.patch(`/incidents/${incidentId}/status`, { status });
  return res.data;
};

export const deleteIncident = async (incidentId) => {
  const res = await client.delete(`/incidents/${incidentId}`);
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await client.get('/dashboard/stats');
  return res.data;
};

export const resetSeedData = async () => {
  const res = await client.post('/reports/seed/reset');
  return res.data;
};

export const getReportJsonUrl = (incidentId) => `${API_BASE}/reports/${incidentId}/json`;
