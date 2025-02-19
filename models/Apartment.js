const { default: mongoose, mongo } = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = new Schema({
  apartment_number: {
    type: String,
  },
  building: {
    type: Schema.Types.ObjectId,
    ref: "buildings",
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
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
