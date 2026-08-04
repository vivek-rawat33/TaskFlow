import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [80, "Title cannot exceed 80 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "General",
        "Frontend",
        "Backend",
        "UI",
        "Feature",
        "Bug Fix",
        "Planning",
          "Research",
  "Technical content",
  "Narrative",
  "Legal",
  "Visual",
  "Financial",
  "Cover page",
  "Table of contents",
  "Plain language",
      ],
      default: "General",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

taskSchema.index(
  { teamId: 1, createdAt: -1 },
  {
    name: "tasks_by_team_newest",
  },
);
taskSchema.index(
  { teamId: 1, status: 1 },
  {
    name: "tasks_by_team_status",
  },
);
taskSchema.index(
  { teamId: 1, priority: 1 },
  {
    name: "tasks_by_team_priority",
  },
);
taskSchema.index(
  { teamId: 1, assignedTo: 1 },
  {
    name: "tasks_by_team_assignee",
  },
);
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ teamId: 1, dueDate: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
