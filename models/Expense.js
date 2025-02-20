const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    deleted_at: {
      type: Date,
      default: null,
    },
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    time_used: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    power_used: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    floors_used: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
