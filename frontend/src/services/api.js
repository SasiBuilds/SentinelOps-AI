const BASE_URL = "https://sentinelops-ai-backend.onrender.com/api/v1";


// ================= AUTH LOGIN =================

export const loginUser = async (email, password) => {

  if (email === "admin@gmail.com" && password === "admin123") {

    const demoToken = "demo-token-12345";

    localStorage.setItem("token", demoToken);

    localStorage.setItem(
      "user",
      JSON.stringify({
        email: "admin@gmail.com",
        role: "admin",
      })
    );

    return {
      success: true,
      message: "Login successful",
    };
  }

  throw new Error("Invalid email or password");
};


// ================= DASHBOARD STATS =================

export const getStats = async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

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


// ================= INCIDENTS =================

export const getIncidents = async () => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/incidents?page=1&limit=20`,
    {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }
  );


  if(!response.ok){
    throw new Error("Failed to fetch incidents");
  }


  return response.json();
};


// ================= INCIDENT STATS =================

export const getIncidentStats = async () => {

  const token = localStorage.getItem("token");


  const response = await fetch(
    `${BASE_URL}/incidents/stats`,
    {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }
  );


  if(!response.ok){
    throw new Error("Failed to fetch incident statistics");
  }


  return response.json();
};


// ================= ALERTS =================

export const getAlerts = async () => {

  const token = localStorage.getItem("token");


  const response = await fetch(
    `${BASE_URL}/alerts?page=1&limit=20`,
    {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }
  );


  if(!response.ok){
    throw new Error("Failed to fetch alerts");
  }


  return response.json();
};


// ================= RECOVERY =================

export const getRecovery = async () => {

  const token = localStorage.getItem("token");


  const response = await fetch(
    `${BASE_URL}/recovery?page=1&limit=20`,
    {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }
  );


  if(!response.ok){
    throw new Error("Failed to fetch recovery data");
  }


  return response.json();
};


// ================= HEALTH =================

export const getServiceHealth = async () => {

  const response = await fetch(
    `${BASE_URL}/health`
  );


  if(!response.ok){
    throw new Error("Failed to fetch health");
  }


  return response.json();
};