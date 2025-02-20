const { default: mongoose, mongo } = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = new Schema(
  {
    pin: {
      type: String,
      required: true,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: "building",
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = Profile = mongoose.model("profile", ProfileSchema);
