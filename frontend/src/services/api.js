const BASE_URL = "https://sentinelops-ai-backend.onrender.com/api/v1";

// Dashboard Stats
export const getStats = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
};

// Incidents
export const getIncidents = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/incidents?page=1&limit=20`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch incidents");
  }

  return response.json();
};

export const getIncidentStats = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/incidents/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch incident statistics");
  }

  return response.json();
};

// Alerts
export const getAlerts = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/alerts?page=1&limit=20`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
};

// Recovery
export const getRecovery = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/recovery?page=1&limit=20`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recovery data");
  }

  return response.json();
};

// Service Health
export const getServiceHealth = async () => {
  const response = await fetch(`${BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Failed to fetch service health");
  }

  return response.json();
};