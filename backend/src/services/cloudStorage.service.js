import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "../utils/api_error.js";

const ensureCloudinaryConfig = () => {
    if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ) {
        throw new ApiError(500, "Missing Cloudinary configuration", []);
    }
};

const uploadAudioToCloud = async ({ buffer, originalName, userId }) => {
    ensureCloudinaryConfig();

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const folder =
        process.env.CLOUDINARY_AUDIO_FOLDER ?? "women-safety/recordings";
    const publicId = `${folder}/user-${userId}-${Date.now()}`;

    const uploadOptions = {
        resource_type: "video",
        public_id: publicId,
        overwrite: false,
        use_filename: Boolean(originalName),
        unique_filename: true,
    };

    if (originalName) {
        uploadOptions.filename_override = originalName;
    }

    return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error || !result) {
                    reject(
                        new ApiError(500, "Failed to upload recording", [
                            error?.message,
                        ])
                    );
                    return;
                }

                resolve({
                    key: result.public_id,
                    url: result.secure_url || result.url,
                    duration: result.duration,
                    bytes: result.bytes,
                });
            }
        );

        uploadStream.end(buffer);
    });
};

export { uploadAudioToCloud };
