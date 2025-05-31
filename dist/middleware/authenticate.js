"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = __importDefault(require("../utils/apiError"));
const data_1 = require("../constant/data");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const client_1 = require("@prisma/client");
const token_repository_1 = require("../api/repository/token.repository");
const user_repository_1 = require("../api/repository/user.repository");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenRepository = new token_repository_1.TokenRepository();
    const userRepository = new user_repository_1.UserRepository();
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!token) {
        return next(new apiError_1.default(data_1.HTTP_NOT_FOUND, "Access token missing!"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        // Try verifying token normally
        const accessToken = yield tokenRepository.getToken(decoded.userId, client_1.TokenType.ACCESS, token);
        if (!accessToken) {
            return next(new apiError_1.default(data_1.HTTP_NOT_FOUND, "Invalid access token!"));
        }
        const user = yield userRepository.getUserById(decoded.userId);
        if (!user) {
            yield tokenRepository.deleteAllTokenByUser(decoded.userId);
            return next(new apiError_1.default(data_1.HTTP_NOT_FOUND, "User not found!"));
        }
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new apiError_1.default(data_1.HTTP_UNAUTHORIZED, "Access token expired!"));
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new apiError_1.default(data_1.HTTP_UNAUTHORIZED, "Invalid access token!"));
        }
        return next(new apiError_1.default(data_1.HTTP_UNAUTHORIZED, "Unauthorized access!"));
    }
});
exports.default = authenticate;
