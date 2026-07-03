import Team from "../models/teamModel.js";
import TeamMember from "../models/teamMemberModel.js";
import User from "../models/userModel.js";
import Task from "../models/Task.js";
export const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Team name is required",
      });
    }

    const team = await Team.create({
      name,
      description,
      createdBy: req.user._id,
    });

    const teamMember = await TeamMember.create({
      teamId: team._id,
      userId: req.user._id,
      role: "owner",
    });

    res.status(201).json({
      message: "Team created successfully",
      team,
      teamMember,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeams = async (req, res, next) => {
  try {
    const memberships = await TeamMember.find({
      userId: req.user._id,
    }).populate("teamId");

    res.status(200).json({
      message: "Teams fetched successfully",
      teams: memberships.map((membership) => ({
        team: membership.teamId,
        role: membership.role,
        membershipId: membership._id,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user._id;
    const membership = await TeamMember.findOne({
      teamId,
      userId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        message: "no team found",
      });
    }

    res.status(200).json({
      team,
      role: membership.role,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamMember = async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user._id;
    const membership = await TeamMember.findOne({ teamId, userId });

    if (!membership) {
      return res.status(403).json({
        message: "you are not the member of this team",
      });
    }

    const members = await TeamMember.find({ teamId }).populate(
      "userId",
      "name email",
    );

    res.status(200).json({
      message: "Members fetched successfully",
      members,
    });
  } catch (error) {
    next(error);
  }
};

export const addTeamMember = async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const currentUserId = req.user._id;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const membership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "you are not a member of this team",
      });
    }

    if (membership.role !== "owner" && membership.role !== "admin") {
      return res.status(403).json({
        message: "you do not have the permission to add members",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingMember = await TeamMember.findOne({
      teamId,
      userId: user._id,
    });

    if (existingMember) {
      return res.status(400).json({
        message: "User is already a member of this team",
      });
    }
    const teamMember = await TeamMember.create({
      teamId,
      userId: user._id,
      role: role || "member",
    });

    const populatedMember = await TeamMember.findById(teamMember._id).populate(
      "userId",
      "name email",
    );

    res.status(200).json({
      message: "Member added successfully",
      member: populatedMember,
    });
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const currentUserId = req.user._id;
    const memberId = req.params.memberId;

    const currentMembership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });

    if (!currentMembership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    if (
      currentMembership.role !== "owner" &&
      currentMembership.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You do not have permission to remove members",
      });
    }

    const memberToRemove = await TeamMember.findOne({
      _id: memberId,
      teamId,
    });

    if (!memberToRemove) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    if (memberToRemove.role === "owner") {
      return res.status(400).json({
        message: "Owner cannot be removed",
      });
    }

    await TeamMember.deleteOne({
      _id: memberId,
      teamId,
    });

    return res.status(200).json({
      message: "Member removed successfully",
      memberId: memberToRemove._id,
    });
  } catch (error) {
    next(error);
  }
};

export const changeMemberRole = async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const currentUserId = req.user._id;
    const memberId = req.params.memberId;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        message: "Role is required",
      });
    }

    if (role !== "viewer" && role !== "admin" && role !== "member") {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const currentMembership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });

    if (!currentMembership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    if (currentMembership.role !== "owner") {
      return res.status(403).json({
        message: "You do not have permission to change member roles",
      });
    }

    const memberToUpdate = await TeamMember.findOne({
      _id: memberId,
      teamId,
    });

    if (!memberToUpdate) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    if (memberToUpdate.role === "owner") {
      return res.status(400).json({
        message: "Owner role cannot be changed",
      });
    }

    memberToUpdate.role = role;
    await memberToUpdate.save();

    const populatedMember = await TeamMember.findById(
      memberToUpdate._id,
    ).populate("userId", "name email");

    return res.status(200).json({
      message: "Member role changed successfully",
      member: populatedMember,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const { name, description } = req.body;
    const currentUserId = req.user._id;

    const currentMembership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });

    if (!currentMembership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    if (
      currentMembership.role !== "owner" &&
      currentMembership.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You do not have permission to update this team",
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        message: "Team name cannot be empty",
      });
    }

    if (name !== undefined) {
      team.name = name.trim();
    }

    if (description !== undefined) {
      team.description = description.trim();
    }

    await team.save();

    return res.status(200).json({
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const currentUserId = req.user._id;

    const currentMembership = await TeamMember.findOne({
      teamId,
      userId: currentUserId,
    });
    if (!currentMembership) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    if (currentMembership.role !== "owner") {
      return res.status(403).json({
        message: "You do not have permission to delete this team",
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    await Task.deleteMany({ teamId });
    await TeamMember.deleteMany({ teamId });
    await Team.findByIdAndDelete(teamId);

    return res.status(200).json({
      message: "Team deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
