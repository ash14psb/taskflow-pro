const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A workspace must have a name"],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workspace", workspaceSchema);
