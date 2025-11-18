import api from "../../utils/api";

// Get all teams for the logged-in user
export const getMyTeams = async () => {
  const res = await api.get("/teams/me");
  return res.data;
};

// Get a single team by ID
export const getTeamById = async (teamId) => {
  const res = await api.get(`/teams/${teamId}`);
  return res.data;
};

// Create a team
export const createTeam = async (data) => {
  const res = await api.post("/teams", data);
  return res.data;
};

// Search users by email
export const searchUsers = async (query) => {
  const res = await api.get(`/users/search?email=${query}`);
  return res.data.users;
};

// Add a member to team
export const addMember = async (teamId, userId) => {
  const res = await api.post(`/teams/${teamId}/members`, { userId });
  return res.data;
};

// Remove member from team
export const removeMember = async (teamId, userId) => {
  const res = await api.delete(`/teams/${teamId}/members/${userId}`);
  return res.data;
};

// Leave team
export const leaveTeam = async (teamId) => {
  const res = await api.post(`/teams/${teamId}/leave`);
  return res.data;
};
