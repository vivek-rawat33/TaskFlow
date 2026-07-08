import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      maxlength: [50, "Team name cannot exceed 50 characters"],
      minlength: [3, "Team name must be at least 3 characters"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot exceed 200 characters"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Team = mongoose.model("Team", teamSchema);
export default Team;
