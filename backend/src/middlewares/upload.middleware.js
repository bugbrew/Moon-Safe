import multer from "multer";
import { ApiError } from "../utils/api_error.js";

const MAX_AUDIO_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB safety cap

const storage = multer.memoryStorage();

const audioFileFilter = (req, file, cb) => {
    if (file.mimetype?.startsWith("audio/")) {
        cb(null, true);
        return;
    }
    cb(new ApiError(400, "Only audio uploads are allowed", []));
};

const audioUpload = multer({
    storage,
    limits: { fileSize: MAX_AUDIO_SIZE_BYTES },
    fileFilter: audioFileFilter,
});

const singleAudioUpload = (req, res, next) => {
    audioUpload.single("recording")(req, res, (err) => {
        if (err) {
            const statusCode = err instanceof ApiError ? err.statusCode : 400;
            return res
                .status(statusCode)
                .json(
                    err instanceof ApiError
                        ? err
                        : new ApiError(statusCode, err.message, [])
                );
        }
        next();
    });
};

export { singleAudioUpload };
