import mongoose from "mongoose";
import Task from "../models/Task.js";
import { validateTaskInput } from "../utils/validateTask.js";
import TeamMember from "../models/teamMemberModel.js";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const cleanTaskPayload = (body) => {
  const payload = {};

  if (body.title !== undefined) payload.title = body.title.trim();
  if (body.description !== undefined) {
    payload.description = body.description.trim();
  }

  if (body.category !== undefined) payload.category = body.category;
  if (body.status !== undefined) payload.status = body.status;
  if (body.priority !== undefined) payload.priority = body.priority;
  if (body.dueDate !== undefined) payload.dueDate = body.dueDate || null;
  if (body.assignedTo !== undefined)
    payload.assignedTo = body.assignedTo || null;

  return payload;
};

const isPastDate = (date) => {
  if (!date) return false;

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate < today;
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;

    const teamId = req.params.teamId;
    const currentUserId = req.user?._id || req.user?.id || req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        message: "User id not found in token",
      });
    }

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    }).lean();

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
      const escapedSearch = escapeRegex(search);
      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
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
    if (req.body.dueDate && isPastDate(req.body.dueDate)) {
      return res.status(400).json({
        message: "Due date cannot be in the past",
      });
    }
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    }).lean();
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
      }).lean();

      if (!assignedUserMembership) {
        return res.status(400).json({ message: "Invalid assignedTo user id" });
      }
    }

    const task = await Task.create({
      ...cleanTaskPayload(req.body),
      teamId,
      createdBy: currentUserId,
      assignedTo: req.body.assignedTo || null,
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
    if (req.body.dueDate && isPastDate(req.body.dueDate)) {
      return res.status(400).json({
        message: "Due date cannot be in the past",
      });
    }

    if (!isValid) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    }).lean();

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    if (membership.role === "viewer") {
      return res.status(403).json({
        message: "You do not have permission to update tasks",
      });
    }

    let filter = { _id: taskId, teamId };
    let payload = {};

    if (membership.role === "member") {
      if (!req.body.status) {
        return res.status(400).json({
          message: "Members can only update task status",
        });
      }
      filter.assignedTo = currentUserId;
      payload = { status: req.body.status };
    } else if (membership.role === "owner" || membership.role === "admin") {
      payload = cleanTaskPayload(req.body);
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      filter,
      payload,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to update it",
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });

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
    }).lean();

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

export const getAllUserTasks = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    const memberships = await TeamMember.find({ userId: currentUserId })
      .select("teamId")
      .lean();

    const teamIds = memberships.map((m) => m.teamId).filter(Boolean);

    if (teamIds.length === 0) {
      return res.status(200).json({
        message: "No tasks found",
        tasks: [],
      });
    }

    const tasks = await Task.find({ teamId: { $in: teamIds } })
      .populate("teamId", "name description")
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "All user tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};
