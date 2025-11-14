import api from "../../utils/api";

export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data.stats;
};
