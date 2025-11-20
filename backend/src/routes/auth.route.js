import { Router } from "express";

import {
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshAccessToken,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unsecure

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// secure

router.get("/me", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, logoutUser);

export default router;
