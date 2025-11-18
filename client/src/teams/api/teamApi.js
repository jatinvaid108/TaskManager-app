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


// ----------------------------------------------------------------------------------------->
// ---------------- TEAM TASKS -----------------

// Get tasks for a team
export const getTeamTasks = async (teamId) => {
  const res = await api.get(`/teams/${teamId}/tasks`);
  return res.data.tasks;
};

// Create a team task
export const createTeamTask = async (teamId, data) => {
  const res = await api.post(`/teams/${teamId}/tasks`, data);
  return res.data.task;
};

// Update team task (status, assignee, etc)
export const updateTeamTask = async (teamId, taskId, data) => {
  const res = await api.put(`/teams/${teamId}/tasks/${taskId}`, data);
  return res.data.task;
};

// Delete task
export const deleteTeamTask = async (teamId, taskId) => {
  const res = await api.delete(`/teams/${teamId}/tasks/${taskId}`);
  return res.data;
};
