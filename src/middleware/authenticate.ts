import {NextFunction, Request, Response} from "express";
import ApiError from "../utils/apiError";
import {HTTP_NOT_FOUND, HTTP_UNAUTHORIZED} from "../constant/data";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "../config/config";
import {TokenType} from "@prisma/client";
import {TokenRepository} from "../api/repository/token.repository";
import {UserRepository} from "../api/repository/user.repository";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const tokenRepository = new TokenRepository();
    const userRepository = new UserRepository();
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return next(new ApiError(HTTP_NOT_FOUND, "Access token missing!"));
    }

    try {
        const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
        // Try verifying token normally
        const accessToken = await tokenRepository.getToken(decoded.userId, TokenType.ACCESS, token);
        if (!accessToken) {
            return next(new ApiError(HTTP_NOT_FOUND, "Invalid access token!"));
        }

        const user = await userRepository.getUserById(decoded.userId);
        if (!user) {
            await tokenRepository.deleteAllTokenByUser(decoded.userId);
            return next(new ApiError(HTTP_NOT_FOUND, "User not found!"));
        }

        return next();
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new ApiError(HTTP_UNAUTHORIZED, "Access token expired!"));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError(HTTP_UNAUTHORIZED, "Invalid access token!"));
        }

        return next(new ApiError(HTTP_UNAUTHORIZED, "Unauthorized access!"));
    }
};

export default authenticate;