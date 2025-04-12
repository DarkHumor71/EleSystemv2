const {default: mongoose, mongo} = require("mongoose");
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
            required: true,
        },
        apartment_number: {
            type: Number,
            required: true,
        },
        deleted_at: {
            type: Date,
        },
        is_moderator: {
            type: Boolean,
            default: false,
        },
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);
ApartmentSchema.index({building: 1, apartment_number: 1}, {unique: true});
ApartmentSchema.methods.softDelete = function () {
    this.deleted_at = new Date();
    return this.save();
};
ApartmentSchema.methods.restore = function () {
    this.deleted_at = null;
    this.createdAt = new Date();
    return this.save();
};
module.exports = Apartment = mongoose.model("apartment", ApartmentSchema);
