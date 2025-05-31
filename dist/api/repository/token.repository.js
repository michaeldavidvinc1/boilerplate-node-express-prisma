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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
class TokenRepository {
    create(tokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.token.create({ data: tokenData });
        });
    }
    getTokenByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.token.findMany({ where: { userId } });
        });
    }
    getToken(userId, type, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.token.findFirst({ where: { userId, type, token } });
        });
    }
    getTokenAccess(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.token.findFirst({
                where: { userId, type: client_1.TokenType.ACCESS },
            });
        });
    }
    getTokenRefresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.token.findFirst({
                where: { token: refreshToken, type: client_1.TokenType.REFRESH },
            });
        });
    }
    deleteToken(tokenId, userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.token.delete({
                where: {
                    id: tokenId,
                    userId,
                    token,
                },
            });
        });
    }
    deleteAllTokenByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.prismaClient.token.deleteMany({ where: { userId } });
        });
    }
}
exports.TokenRepository = TokenRepository;
