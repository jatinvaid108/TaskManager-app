import api from "../../utils/api";

export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data.stats;
};

// Get all users
export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

// Delete a user
export const deleteUserById = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

// Get all tasks system-wide
export const getAllTasksAdmin = async () => {
  const res = await api.get("/admin/tasks");
  return res.data;
};

// Hard delete a task
export const hardDeleteTask = async (id) => {
  const res = await api.delete(`/admin/tasks/${id}`);
  return res.data;
};
