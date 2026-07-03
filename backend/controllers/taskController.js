import mongoose from "mongoose";
import Task from "../models/Task.js";
import { validateTaskInput } from "../utils/validateTask.js";
import TeamMember from "../models/teamMemberModel.js";
import teamMemberModel from "../models/teamMemberModel.js";

const cleanTaskPayload = (body) => ({
  title: body.title?.trim(),
  description: body.description?.trim() || "",
  status: body.status || "pending",
  priority: body.priority || "medium",
  dueDate: body.dueDate || null,
  assignedTo: body.assignedTo || null,
});

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;

    const teamId = req.params.teamId;
    const currentUserId = req.user._id;

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    const filter = {
      teamId,
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (priority && priority !== "all") {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};
export const createTask = async (req, res, next) => {
  try {
    const { isValid, errors } = validateTaskInput(req.body);
    const teamId = req.params.teamId;
    const currentUserId = req.user._id;
    const { title, assignedTo } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });
    if (!membership) {
      return res
        .status(403)
        .json({ message: "You are not a member of this team" });
    }

    if (membership.role === "viewer") {
      return res
        .status(403)
        .json({ message: "You do not have permission to create tasks" });
    }

    if (assignedTo) {
      const assignedUserMembership = await TeamMember.findOne({
        teamId,
        userId: assignedTo,
      });

      if (!assignedUserMembership) {
        return res.status(400).json({ message: "Invalid assignedTo user id" });
      }
    }

    const task = await Task.create({
      ...cleanTaskPayload(req.body),
      teamId,
      createdBy: currentUserId,
      assignedTo: assignedTo || null,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const teamId = req.params.teamId;
    const currentUserId = req.user._id;

    const { isValid, errors } = validateTaskInput(req.body, true);

    if (!isValid) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      teamId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (membership.role === "viewer") {
      return res.status(403).json({
        message: "You do not have permission to update tasks",
      });
    }

    if (membership.role === "member") {
      if (
        !task.assignedTo ||
        task.assignedTo.toString() !== currentUserId.toString()
      ) {
        return res.status(403).json({
          message: "You can only update tasks assigned to you",
        });
      }

      if (!req.body.status) {
        return res.status(400).json({
          message: "Members can only update task status",
        });
      }

      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, teamId },
        { status: req.body.status },
        {
          new: true,
          runValidators: true,
        },
      )
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");

      return res.status(200).json({
        message: "Task status updated successfully",
        task: updatedTask,
      });
    }

    if (membership.role === "owner" || membership.role === "admin") {
      const payload = cleanTaskPayload(req.body);

      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, teamId },
        payload,
        {
          new: true,
          runValidators: true,
        },
      )
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");

      return res.status(200).json({
        message: "Task updated successfully",
        task: updatedTask,
      });
    }

    return res.status(403).json({
      message: "Invalid role",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const teamId = req.params.teamId;
    const currentUserId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    if (membership.role !== "owner" && membership.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to delete tasks",
      });
    }

    const task = await Task.findOneAndDelete({
      teamId,
      _id: taskId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", taskId });
  } catch (error) {
    next(error);
  }
};
