import api from "../utils/api";

// Assign task to a user
export const assignTask = async (taskId, assignedTo) => {
  const res = await api.put(`/todos/${taskId}/assign`, { assignedTo });
  return res.data;
};

// Unassign task
export const unassignTask = async (taskId) => {
  const res = await api.put(`/todos/${taskId}/unassign`);
  return res.data;
};
