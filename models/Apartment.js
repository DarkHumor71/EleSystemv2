const { default: mongoose, mongo } = require("mongoose");
const Schema = mongoose.Schema;
const ApartmentSchema = new Schema(
  {
    pin: {
      type: String,
      required: true,
      unique: true,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: "building",
    },
    deleted_at: {
      type: Date,
    },
    is_moderator: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = Apartment = mongoose.model("apartment", ApartmentSchema);
