import { apiClient } from "./apiClient";

export const getTeamAnnouncements = async (teamId) => {
  const response = await apiClient.get(`/teams/${teamId}/announcements`);
  return response.data;
};

export const createTeamAnnouncement = async (teamId, announcementData) => {
  const response = await apiClient.post(
    `/teams/${teamId}/announcements`,
    announcementData,
  );

  return response.data;
};

export const deleteTeamAnnouncement = async (teamId, announcementId) => {
  const response = await apiClient.delete(
    `/teams/${teamId}/announcements/${announcementId}`,
  );

  return response.data;
};
