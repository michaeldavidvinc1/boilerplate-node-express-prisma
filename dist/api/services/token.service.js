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
exports.TokenService = void 0;
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const client_1 = require("@prisma/client");
class TokenService {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    generateToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, expires, type, secret }) {
            const payload = {
                sub: userId,
                iat: (0, moment_1.default)().unix(),
                exp: Math.floor(expires.getTime() / 1000),
                type,
            };
            return jsonwebtoken_1.default.sign(payload, secret);
        });
    }
    generateAccessToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessTokenExpire = (0, moment_1.default)().add(config_1.default.jwt_expire, "days");
            const accessToken = yield this.generateToken({
                userId,
                expires: accessTokenExpire.toDate(),
                type: client_1.TokenType.ACCESS,
                secret: config_1.default.jwt_secret,
            });
            yield this.tokenRepository.create({
                token: accessToken,
                userId,
                expires: accessTokenExpire.toDate(),
                type: client_1.TokenType.ACCESS,
            });
            return {
                token: accessToken, expires: accessTokenExpire.toDate()
            };
        });
    }
    generateRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenExpires = (0, moment_1.default)().add(config_1.default.jwt_refresh_expire, "days");
            const refreshToken = yield this.generateToken({
                userId,
                expires: refreshTokenExpires.toDate(),
                type: client_1.TokenType.REFRESH,
                secret: config_1.default.jwt_secret,
            });
            yield this.tokenRepository.create({
                token: refreshToken,
                userId,
                expires: refreshTokenExpires.toDate(),
                type: client_1.TokenType.REFRESH,
            });
            return {
                token: refreshToken, expires: refreshTokenExpires.toDate()
            };
        });
    }
}
exports.TokenService = TokenService;
