import Team from "../models/Team.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import { teamInviteTemplate } from "../utils/emailTemplates.js";
import { createNotification } from "../utils/createNotification.js";


// ------------------------------------------------------------
// Create Team
// ------------------------------------------------------------
export const createTeam = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    const team = new Team({
      name,
      description: description || "",
      createdBy: req.user._id,
      members: [
        { user: req.user._id, role: "owner" },
        ...members.map(m => ({ user: m.userId, role: m.role || "member" }))
      ]
    });

    await team.save();

    // Notify invited members
    for (const member of members) {
      await createNotification(
        member.userId,
        "team_invite",
        `${req.user.name} added you to team ${name}`,
        `/teams/${team._id}`
      );
    }

    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ------------------------------------------------------------
// Get all teams for logged-in user
// ------------------------------------------------------------
export const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ "members.user": req.user._id })
      .populate("members.user", "name email");

    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ------------------------------------------------------------
// Get Single Team Details
// ------------------------------------------------------------
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate("members.user", "name email");

    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ------------------------------------------------------------
// Add Member to Team
// ------------------------------------------------------------
export const addMember = async (req, res) => {
  try {
    const { userId, role = "member" } = req.body;

    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.members.some(m => m.user.toString() === userId)) {
      return res.status(400).json({ message: "User already a member" });
    }

    team.members.push({ user: userId, role });
    await team.save();

    const userToAdd = await User.findById(userId);

    if (userToAdd) {
      // send email notification
      await sendEmail({
        to: userToAdd.email,
        subject: `You were added to the team: ${team.name}`,
        html: teamInviteTemplate(req.user.name, team.name),
        text: `${req.user.name} added you to the team: ${team.name}.`
      });

      // in-app notification
      await createNotification(
        userId,
        "team_invite",
        `${req.user.name} added you to the team ${team.name}`,
        `/teams/${team._id}`
      );
    }

    await team.populate("members.user", "name email");
    res.json({ success: true, team });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ------------------------------------------------------------
// Remove Member
// ------------------------------------------------------------
export const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter(m => m.user.toString() !== memberId);
    await team.save();

    // notify removed user
    await createNotification(
      memberId,
      "team_remove",
      `You were removed from team ${team.name}`,
      `/teams`
    );

    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ------------------------------------------------------------
// Leave Team
// ------------------------------------------------------------
export const leaveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter(
      m => m.user.toString() !== req.user._id.toString()
    );

    await team.save();

    await createNotification(
      req.user._id,
      "team_leave",
      `You left the team ${team.name}`,
      `/teams`
    );

    res.json({ success: true, message: "Left team" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
