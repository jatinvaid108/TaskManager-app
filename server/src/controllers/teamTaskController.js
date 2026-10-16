import Todo from "../models/Todo.js";
import Team from "../models/Team.js";

export const createTeamTask = async (req, res) => {
  try {
    const { name, description, assignedTo } = req.body;

    console.log("📥 Incoming Task Data:", req.body);

    if (!name) return res.status(400).json({ message: "Task name is required" });

    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Check if user is member
    const member = team.members.find(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!member)
      return res.status(403).json({ message: "You are not a team member" });

    // Check if admin/owner
    if (!["owner", "admin"].includes(member.role))
      return res.status(403).json({ message: "Only admins can create tasks" });

    // Create the task
    const task = await Todo.create({
      title: name,          // 🔥 your Todo schema expects "title", NOT "name"
      description,
      team: team._id,
      assignedTo,
      assignedBy: req.user._id
    });

    res.status(201).json({ success: true, task });

  } catch (err) {
    console.error("❌ TEAM TASK CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};




export const getTeamTasks = async (req, res) => {
  try {
    const tasks = await Todo.find({ team: req.params.teamId })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTeamTask = async (req, res) => {
  try {
    // Task must belong to this team
    const task = await Todo.findOne({ _id: req.params.taskId, team: req.params.teamId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTeamTask = async (req, res) => {
  try {
    // Task must belong to this team
    const task = await Todo.findOneAndDelete({ _id: req.params.taskId, team: req.params.teamId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
