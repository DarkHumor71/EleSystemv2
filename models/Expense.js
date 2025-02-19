const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const expenseSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartments",
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
  from_floor: {
    type: Number,
    required: true,
  },
  to_floor: {
    type: Number,
    required: true,
  },
});

expenseSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
