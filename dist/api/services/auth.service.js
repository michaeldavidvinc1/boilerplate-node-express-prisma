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
exports.AuthService = void 0;
const apiError_1 = __importDefault(require("../../utils/apiError"));
const auth_validation_1 = require("../../validation/auth.validation");
const validation_1 = require("../../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_1 = require("../../constant/data");
const moment_1 = __importDefault(require("moment"));
class AuthService {
    constructor(userRepository, tokenService, tokenRepository) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.tokenRepository = tokenRepository;
    }
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = validation_1.Validation.validate(auth_validation_1.AuthValidation.LOGIN, req);
            const user = yield this.userRepository.getUserByEmail(loginRequest.email);
            if (!user) {
                throw new apiError_1.default(data_1.HTTP_FORBIDDEN, "Incorrect email or password");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(loginRequest.password, user.password);
            if (!isPasswordValid) {
                throw new apiError_1.default(data_1.HTTP_FORBIDDEN, "Incorrect email or password");
            }
            const checkTokenExists = yield this.tokenRepository.getTokenByUserId(user.id);
            if (checkTokenExists) {
                yield this.tokenRepository.deleteAllTokenByUser(user.id);
            }
            const tokenAccess = yield this.tokenService.generateAccessToken(user.id);
            const tokenRefresh = yield this.tokenService.generateRefreshToken(user.id);
            return {
                user,
                tokens: {
                    access: tokenAccess,
                    refresh: tokenRefresh,
                }
            };
        });
    }
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRequest = validation_1.Validation.validate(auth_validation_1.AuthValidation.REGISTER, req);
            const checkUser = yield this.userRepository.getUserByEmail(registerRequest.email);
            if (checkUser) {
                throw new apiError_1.default(data_1.HTTP_CONFLICT, "Email already exists!");
            }
            registerRequest.password = yield bcrypt_1.default.hash(registerRequest.password, 10);
            const user = yield this.userRepository.createUser(registerRequest);
            const tokenAccess = yield this.tokenService.generateAccessToken(user.id);
            const tokenRefresh = yield this.tokenService.generateRefreshToken(user.id);
            return {
                user,
                tokens: {
                    access: tokenAccess,
                    refresh: tokenRefresh,
                }
            };
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedRefreshToken = yield this.tokenRepository.getTokenRefresh(refreshToken);
            console.info('storedRefreshToken', storedRefreshToken);
            if (!storedRefreshToken) {
                throw new apiError_1.default(data_1.HTTP_NOT_FOUND, "Refresh token not found!");
            }
            if ((0, moment_1.default)().isAfter((0, moment_1.default)(storedRefreshToken.expires))) {
                throw new apiError_1.default(data_1.HTTP_UNAUTHORIZED, "Session expired. Please login again!");
            }
            const user = yield this.userRepository.getUserById(storedRefreshToken.userId);
            console.info('user', user);
            if (!user) {
                throw new apiError_1.default(data_1.HTTP_FORBIDDEN, "Token is not valid!");
            }
            const oldAccessToken = yield this.tokenRepository.getTokenAccess(user.id);
            console.info('oldAccessToken', oldAccessToken);
            if (oldAccessToken) {
                yield this.tokenRepository.deleteToken(oldAccessToken.id, user.id, oldAccessToken.token);
            }
            const newAccessToken = yield this.tokenService.generateAccessToken(user.id);
            console.info('newAccessToken', newAccessToken);
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                tokens: {
                    access: newAccessToken,
                    refresh: storedRefreshToken,
                }
            };
        });
    }
}
exports.AuthService = AuthService;
