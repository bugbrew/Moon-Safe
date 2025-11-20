import User from "../models/user.model.js";
import { AsyncHandler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import jwt from "jsonwebtoken";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
    const rawAuth = req.header("Authorization") || "";
    const token =
        req.cookies?.accessToken ||
        (rawAuth.startsWith("Bearer ") ? rawAuth.substring(7) : null);

    if (!token) {
        throw new ApiError(401, "Missing Bearer token");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid access token Middleware User not found",
            );
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(
            401,
            "Invalid access token Middleware Error" + error.message,
        );
    }
});
