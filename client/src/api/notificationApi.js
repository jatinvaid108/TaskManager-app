import api from "../utils/api";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data.notifications;
};

export const markNotificationRead = async (id) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
  await api.put(`/notifications/read-all`);
};
