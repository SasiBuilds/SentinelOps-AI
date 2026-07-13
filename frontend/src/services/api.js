const BASE_URL = "https://sentinelops-ai-backend.onrender.com/api/v1";

export const getDashboardStats = async () => {
  const response = await fetch(`${BASE_URL}/dashboard`);
  return response.json();
};

export const getIncidents = async () => {
  const response = await fetch(`${BASE_URL}/incidents`);
  return response.json();
};

export const getRecoveries = async () => {
  const response = await fetch(`${BASE_URL}/recoveries`);
  return response.json();
};

export const getServiceHealth = async () => {
  const response = await fetch(`${BASE_URL}/services`);
  return response.json();
};