import Meeting from "../models/meetingModel.js";
import TeamMember from "../models/teamMemberModel.js";

export const getMeetings = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const currentUserId = req.user._id;

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    }).lean();

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    const filter = { teamId };

    // Optional month filter: ?month=2026-08
    if (req.query.month) {
      const [year, month] = req.query.month.split("-").map(Number);
      if (year && month) {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        filter.date = { $gte: startOfMonth, $lte: endOfMonth };
      }
    }

    const meetings = await Meeting.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: 1, startTime: 1 })
      .lean();

    return res.status(200).json({
      message: "Meetings fetched successfully",
      meetings,
    });
  } catch (error) {
    next(error);
  }
};

export const createMeeting = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const currentUserId = req.user._id;
    const { title, description, date, startTime, endTime, meetingUrl } =
      req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Meeting title is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Meeting date is required",
      });
    }

    if (!startTime || startTime.trim() === "") {
      return res.status(400).json({
        message: "Start time is required",
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

    if (membership.role !== "owner" && membership.role !== "admin") {
      return res.status(403).json({
        message: "Only owner or admin can create meetings",
      });
    }

    const meeting = await Meeting.create({
      teamId,
      title: title.trim(),
      description: description?.trim() || "",
      date: new Date(date),
      startTime: startTime.trim(),
      endTime: endTime?.trim() || "",
      meetingUrl: meetingUrl?.trim() || "",
      createdBy: currentUserId,
    });

    const populatedMeeting = await Meeting.findById(meeting._id).populate(
      "createdBy",
      "name email",
    );

    return res.status(201).json({
      message: "Meeting created successfully",
      meeting: populatedMeeting,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMeeting = async (req, res, next) => {
  try {
    const { teamId, meetingId } = req.params;
    const currentUserId = req.user._id;

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
        message: "Only owner or admin can delete meetings",
      });
    }

    const meeting = await Meeting.findOneAndDelete({
      _id: meetingId,
      teamId,
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      message: "Meeting deleted successfully",
      meetingId,
    });
  } catch (error) {
    next(error);
  }
};
