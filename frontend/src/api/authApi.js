import { apiClient } from "./apiClient";
export const signupUser = async (userData) => {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/auth/signin", credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

