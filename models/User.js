const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "moderator", "resident", "brain"],
      default: "resident",
    },
    apartment: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      default: null,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);
module.exports = User = mongoose.model("user", UserSchema);
