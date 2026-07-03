import { apiClient } from "./apiClient";

export const getMyTeams = async () => {
  const response = await apiClient.get("/teams");
  return response.data;
};

export const createTeam = async (teamData) => {
  const response = await apiClient.post("/teams", teamData);
  return response.data;
};

export const getTeamById = async (teamId) => {
  const response = await apiClient.get(`/teams/${teamId}`);
  return response.data;
};

export const updateTeam = async (teamId, teamData) => {
  const response = await apiClient.patch(`/teams/${teamId}`, teamData);
  return response.data;
};

export const deleteTeam = async (teamId) => {
  const response = await apiClient.delete(`/teams/${teamId}`);
  return response.data;
};

export const getTeamMembers = async (teamId) => {
  const response = await apiClient.get(`/teams/${teamId}/members`);
  return response.data;
};

export const addTeamMember = async (teamId, memberData) => {
  const response = await apiClient.post(`/teams/${teamId}/members`, memberData);
  return response.data;
};

export const removeTeamMember = async (teamId, memberId) => {
  const response = await apiClient.delete(
    `/teams/${teamId}/members/${memberId}`,
  );
  return response.data;
};

export const changeMemberRole = async (teamId, memberId, role) => {
  const response = await apiClient.patch(
    `/teams/${teamId}/members/${memberId}/role`,
    {
      role,
    },
  );
  return response.data;
};
