import api from "./api";

export const getRecoveries = async () => {
  const response = await api.get("/recoveries");
  return response.data;
};