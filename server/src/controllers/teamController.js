import Team from "../models/Team.js";
import User from "../models/User.js";

// Create team
export const createTeam = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    // create team with creator as owner
    const team = new Team({
      name,
      description: description || "",
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: "owner" }, ...members.map(m => ({ user: m.userId, role: m.role || "member" }))]
    });

    await team.save();
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get teams for the logged-in user
export const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ "members.user": req.user._id }).populate("members.user", "name email");
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single team
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId).populate("members.user", "name email");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add member (team admin/owner only)
export const addMember = async (req, res) => {
  try {
    const { userId, role = "member" } = req.body;
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // prevent duplicate
    if (team.members.some(m => m.user.toString() === userId)) {
      return res.status(400).json({ message: "User already a member" });
    }

    team.members.push({ user: userId, role });
    await team.save();
    await team.populate("members.user", "name email");
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove member (team admin/owner only)
export const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params; // member's user id
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter(m => m.user.toString() !== memberId);
    await team.save();
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Leave team (member can leave)
export const leaveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter(m => m.user.toString() !== req.user._id.toString());
    await team.save();
    res.json({ success: true, message: "Left team" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
