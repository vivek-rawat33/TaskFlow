import mongoose from "mongoose";
import Task from "../models/Task.js";
import { validateTaskInput } from "../utils/validateTask.js";

const cleanTaskPayload = (body) => ({
  title: body.title?.trim(),
  description: body.description?.trim() || "",
  status: body.status || "pending",
  priority: body.priority || "medium",
  dueDate: body.dueDate || null,
});

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const filter = {};

    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { isValid, errors } = validateTaskInput(req.body);

    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const task = await Task.create(cleanTaskPayload(req.body));
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const { isValid, errors } = validateTaskInput(req.body, true);

    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const payload = cleanTaskPayload(req.body);

    const updatedTask = await Task.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", id });
  } catch (error) {
    next(error);
  }
};
