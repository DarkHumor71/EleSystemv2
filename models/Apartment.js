const { default: mongoose, mongo } = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = new Schema(
  {
    number: {
      type: String,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: "building",
    },
    pin: {
      type: String,
      required: true,
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
