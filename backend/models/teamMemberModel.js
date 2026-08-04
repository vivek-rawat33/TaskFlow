import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["member", "admin", "owner", "viewer"],
      default: "member",
    },
  },

  {
    timestamps: true,
  },
);

teamMemberSchema.index(
  { userId: 1 },
  {
    name: "Membership_by_user",
  },
);

teamMemberSchema.index(
  { teamId: 1, userId: 1 },
  { unique: true, name: "unique_teamMember" }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;
