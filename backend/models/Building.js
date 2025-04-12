const {default: mongoose, mongo} = require("mongoose");
const Schema = mongoose.Schema;

const BuildingSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
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
        deleted_at: {
            type: Date,
            default: null,
        },
        password: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

module.exports = Building = mongoose.model("building", BuildingSchema);
