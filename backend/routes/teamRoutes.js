import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTeam,
  deleteTeam,
  getTeams,
  getTeamById,
  getTeamMember,
  addTeamMember,
  updateTeam,
  removeTeamMember,
  changeMemberRole,
} from "../controllers/teamController.js";

import taskRoutes from "./taskRoutes.js";
const router = express.Router();

router.post("/", protect, createTeam);
router.get("/", protect, getTeams);

router.get("/:teamId/members", protect, getTeamMember);
router.post("/:teamId/members", protect, addTeamMember);

router.use("/:teamId/tasks", taskRoutes);
router.delete("/:teamId/members/:memberId", protect, removeTeamMember);
router.patch("/:teamId/members/:memberId/role", protect, changeMemberRole);
router.patch("/:teamId", protect, updateTeam);
router.delete("/:teamId", protect, deleteTeam);
router.get("/:teamId", protect, getTeamById);
export default router;
