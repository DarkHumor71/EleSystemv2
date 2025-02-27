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
    apartment: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
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
