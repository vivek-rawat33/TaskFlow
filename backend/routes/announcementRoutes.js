import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getAnnouncements);
router.post("/", protect, createAnnouncement);
router.delete("/:announcementId", protect, deleteAnnouncement);

export default router;
