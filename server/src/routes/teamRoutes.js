import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isTeamMember, isTeamAdminOrOwner } from "../middleware/teamMiddleware.js";
import {
  createTeam,
  getMyTeams,
  getTeamById,
  addMember,
  removeMember,
  leaveTeam,
} from "../controllers/teamController.js";

const router = express.Router();

router.use(protect);

// create team
router.post("/", createTeam);

// get teams of logged-in user
router.get("/me", getMyTeams);

// get single team (only members can view)
router.get("/:teamId", isTeamMember, getTeamById);

// admin/add member
router.post("/:teamId/members", isTeamAdminOrOwner, addMember);

// remove member (admin)
router.delete("/:teamId/members/:memberId", isTeamAdminOrOwner, removeMember);

// leave team (self)
router.post("/:teamId/leave", protect, leaveTeam);

export default router;
