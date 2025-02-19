const { default: mongoose, mongo } = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    password: {
      type: String,
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

module.exports = Post = mongoose.model("post", PostSchema);
