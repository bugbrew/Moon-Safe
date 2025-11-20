import mongoose , {Schema}from "mongoose";

const EmergencyContactSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        relationship: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Assuming you have a User model
            required: true,
        },
    },
    { timestamps: true },
);

const EmergencyContact = mongoose.model("EmergencyContact", EmergencyContactSchema);
export default EmergencyContact;