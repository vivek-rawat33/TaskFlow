import { apiClient } from "./apiClient";

export const getTeamTasks = async (teamId, filters = {}) => {
  if (!teamId) {
    throw new Error("teamId is required to fetch tasks");
  }
  const response = await apiClient.get(`/teams/${teamId}/tasks`, {
    params: filters,
  });
  return response.data;
};

export const createTeamTask = async (teamId, taskData) => {
  const response = await apiClient.post(`/teams/${teamId}/tasks`, taskData);
  return response.data;
};

export const updateTeamTask = async (teamId, taskId, taskData) => {
  const response = await apiClient.patch(
    `/teams/${teamId}/tasks/${taskId}`,
    taskData,
  );
  return response.data;
};

export const deleteTeamTask = async (teamId, taskId) => {
  const response = await apiClient.delete(`/teams/${teamId}/tasks/${taskId}`);
  return response.data;
};
