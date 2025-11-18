import api from "../../utils/api";

// create team
export const createTeam = async (data) => {
  const res = await api.post("/teams", data);
  return res.data;
};

export const getMyTeams = async () => {
  const res = await api.get("/teams/me");
  return res.data;
};

export const getTeam = async (teamId) => {
  const res = await api.get(`/teams/${teamId}`);
  return res.data;
};

export const addMemberToTeam = async (teamId, payload) => {
  const res = await api.post(`/teams/${teamId}/members`, payload);
  return res.data;
};

export const removeMemberFromTeam = async (teamId, memberId) => {
  const res = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return res.data;
};

export const leaveTeam = async (teamId) => {
  const res = await api.post(`/teams/${teamId}/leave`);
  return res.data;
};
