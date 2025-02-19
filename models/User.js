const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "moderator", "resident", "brain"],
    default: "resident",
  },
  apartment: {
    type: Schema.Types.ObjectId,
    ref: "Apartments",
    default: null,
  },
  building: {
    type: Schema.Types.ObjectId,
    ref: "Buildings",
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});
module.exports = User = mongoose.model("user", UserSchema);
