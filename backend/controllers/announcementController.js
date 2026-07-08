import Announcement from "../models/announcementModel.js";
import TeamMember from "../models/teamMemberModel.js";

export const getAnnouncements = async (req, res, next) => {
  try {
    const { teamId } = req.params;
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

    const announcements = await Announcement.find({ teamId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Announcements fetched successfully",
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const currentUserId = req.user._id;
    const { title, message } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Announcement title is required",
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Announcement message is required",
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

    if (membership.role !== "owner" && membership.role !== "admin") {
      return res.status(403).json({
        message: "Only owner or admin can create announcements",
      });
    }

    const announcement = await Announcement.create({
      teamId,
      title: title.trim(),
      message: message.trim(),
      createdBy: currentUserId,
    });

    const populatedAnnouncement = await Announcement.findById(
      announcement._id,
    ).populate("createdBy", "name email");

    return res.status(201).json({
      message: "Announcement created successfully",
      announcement: populatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { teamId, announcementId } = req.params;
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

    if (membership.role !== "owner" && membership.role !== "admin") {
      return res.status(403).json({
        message: "Only owner or admin can delete announcements",
      });
    }

    const announcement = await Announcement.findOne({
      _id: announcementId,
      teamId,
    });

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }

    await Announcement.deleteOne({
      _id: announcementId,
      teamId,
    });

    return res.status(200).json({
      message: "Announcement deleted successfully",
      announcementId,
    });
  } catch (error) {
    next(error);
  }
};
