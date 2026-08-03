import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMeetings,
  createMeeting,
  deleteMeeting,
} from "../controllers/meetingController.js";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getMeetings);
router.post("/", protect, createMeeting);
router.delete("/:meetingId", protect, deleteMeeting);

export default router;
