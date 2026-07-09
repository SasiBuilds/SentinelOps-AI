const BASE_URL = "http://localhost:5000/api";

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