import { Router } from "express";
import { singleAudioUpload } from "../middlewares/upload.middleware.js";
import { uploadRecording } from "../controllers/recording.controller.js";

const router = Router();

router.post("/recordings", singleAudioUpload, uploadRecording);

export default router;
