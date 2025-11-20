import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
    {
        latitude: {
            type: Number,
            min: -90,
            max: 90,
        },
        longitude: {
            type: Number,
            min: -180,
            max: 180,
        },
    },
    { _id: false }
);

const recordingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        durationSeconds: {
            type: Number,
            default: 10,
            min: 1,
        },
        sizeBytes: {
            type: Number,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        cloudStorageKey: {
            type: String,
            required: true,
        },
        cloudStorageUrl: {
            type: String,
            required: true,
        },
        recordedAt: {
            type: Date,
            default: Date.now,
        },
        location: locationSchema,
        status: {
            type: String,
            enum: ["received", "uploaded", "error"],
            default: "uploaded",
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const Recording = mongoose.model("Recording", recordingSchema);

export default Recording;
