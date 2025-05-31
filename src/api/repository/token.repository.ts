import {TokenType} from "@prisma/client";
import {TokenEntity} from "../../entity/token.entity";
import {prismaClient} from "../../config/db";
import {ITokenCreate} from "../../interface/token.interface";
import {TokenRepositoryImpl} from "./impl/token.repository.impl";

export class TokenRepository implements TokenRepositoryImpl {
    async create(tokenData: ITokenCreate): Promise<TokenEntity> {
        return prismaClient.token.create({ data: tokenData });
    }

    async getTokenByUserId(userId: string): Promise<TokenEntity[]> {
        return prismaClient.token.findMany({ where: { userId } });
    }

    async getToken(userId: string, type: TokenType, token: string): Promise<TokenEntity | null> {
        return prismaClient.token.findFirst({ where: { userId, type, token } });
    }

    async getTokenAccess(userId: string): Promise<TokenEntity | null> {
        return prismaClient.token.findFirst({
            where: { userId, type: TokenType.ACCESS },
        });
    }

    async getTokenRefresh(refreshToken: string): Promise<TokenEntity | null> {
        return prismaClient.token.findFirst({
            where: { token: refreshToken, type: TokenType.REFRESH },
        });
    }

    async deleteToken(tokenId: string, userId: string, token: string): Promise<TokenEntity> {
        return prismaClient.token.delete({
            where: {
                id: tokenId,
                userId,
                token,
            },
        });
    }

    async deleteAllTokenByUser(userId: string): Promise<void> {
        await prismaClient.token.deleteMany({ where: { userId } });
    }
}