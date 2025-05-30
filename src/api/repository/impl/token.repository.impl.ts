import {ITokenCreate} from "../../../interface/token.interface";
import {TokenEntity} from "../../../entity/token.entity";
import {TokenType} from "@prisma/client";

export interface TokenRepositoryImpl {
    create(tokenData: ITokenCreate): Promise<TokenEntity>;
    getTokenByUserId(userId: string): Promise<TokenEntity[]>;
    getToken(userId: string, type: TokenType, token: string): Promise<TokenEntity | null>;
    getTokenRefresh(userId: string): Promise<TokenEntity | null>;
    deleteToken(tokenId: string, userId: string, token: string): Promise<TokenEntity>;
    deleteAllTokenByUser(userId: string): Promise<void>;
}