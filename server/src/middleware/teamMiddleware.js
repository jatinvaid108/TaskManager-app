import Team from "../models/Team.js";

export const isTeamMember = async (req, res, next) => {
  try {
    const teamId = req.params.teamId || req.body.teamId || req.query.teamId;
    if (!teamId) return res.status(400).json({ message: "teamId required" });

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const isMember = team.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: "Not a team member" });

    req.team = team;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const isTeamAdminOrOwner = async (req, res, next) => {
  try {
    const teamId = req.params.teamId || req.body.teamId || req.query.teamId;
    if (!teamId) return res.status(400).json({ message: "teamId required" });

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const member = team.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member) return res.status(403).json({ message: "Not a team member" });
    if (member.role === "owner" || member.role === "admin") {
      req.team = team;
      return next();
    }
    return res.status(403).json({ message: "Requires team admin/owner role" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
