import { apiClient } from "./apiClient";

export const getTeamMeetings = async (teamId, month) => {
  const params = {};
  if (month) {
    params.month = month;
  }
  const response = await apiClient.get(`/teams/${teamId}/meetings`, {
    params,
  });
  return response.data;
};

export const createTeamMeeting = async (teamId, meetingData) => {
  const response = await apiClient.post(
    `/teams/${teamId}/meetings`,
    meetingData,
  );
  return response.data;
};

export const deleteTeamMeeting = async (teamId, meetingId) => {
  const response = await apiClient.delete(
    `/teams/${teamId}/meetings/${meetingId}`,
  );
  return response.data;
};
