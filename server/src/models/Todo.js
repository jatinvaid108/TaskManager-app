import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    // -------- Personal Task Owner --------
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null   // ❗ was required earlier → now optional
    },

    // -------- Team Task Owner --------
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },

    // -------- Task Name (Universal) --------
    name: {
      type: String,
      required: true,   //  replaces old `title`
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    // -------- Priority (Still supports personal tasks) --------
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    dueDate: {
      type: Date,
      default: null
    },

    // -------- Task Status (Team + personal both use this) --------
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },

    // -------- Assignment --------
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // -------- Soft Delete (Trash) --------
    deleted: {
      type: Boolean,
      default: false
    },

    // -------- Future Collaboration Feature --------
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
