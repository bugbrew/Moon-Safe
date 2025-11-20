import Recording from "../models/recording.model.js";
import User from "../models/user.model.js";
import { AsyncHandler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { uploadAudioToCloud } from "../services/cloudStorage.service.js";

const uploadRecording = AsyncHandler(async (req, res) => {
    const {
        userId,
        durationSeconds = 10,
        recordedAt,
        latitude,
        longitude,
        notes,
    } = req.body;

    if (!req.file) {
        return res
            .status(400)
            .json(new ApiError(400, "Audio file is required", []));
    }

    if (!userId) {
        return res
            .status(400)
            .json(new ApiError(400, "userId is required", []));
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
        return res
            .status(404)
            .json(new ApiError(404, "User does not exist", []));
    }

    const uploadResult = await uploadAudioToCloud({
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
        userId,
    });

    const recordingPayload = {
        user: userId,
        durationSeconds: Number(durationSeconds) || 10,
        sizeBytes: req.file.size,
        mimeType: req.file.mimetype,
        cloudStorageKey: uploadResult.key,
        cloudStorageUrl: uploadResult.url,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
        notes,
    };

    // if (latitude && longitude) {
    //     recordingPayload.location = {
    //         latitude: Number(latitude),
    //         longitude: Number(longitude),
    //     };
    // }

    const recording = await Recording.create(recordingPayload);

    return res
        .status(201)
        .json(new ApiResponse(201, recording, "Recording stored successfully"));
});

export { uploadRecording };
