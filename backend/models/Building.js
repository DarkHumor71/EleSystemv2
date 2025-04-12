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
BuildingSchema.methods.softDelete = function () {
    this.deleted_at = new Date();
    return this.save();
};
BuildingSchema.methods.restore = function () {
    this.deleted_at = null;
    this.createdAt = new Date();
    return this.save();
};

module.exports = Building = mongoose.model("building", BuildingSchema);
