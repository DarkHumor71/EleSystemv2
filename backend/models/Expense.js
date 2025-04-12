const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
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
        time: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        power: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        cost: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

const Expense = mongoose.model("expense", ExpenseSchema);

module.exports = Expense;
