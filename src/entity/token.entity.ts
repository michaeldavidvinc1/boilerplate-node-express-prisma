import {TokenType} from "@prisma/client";

export interface TokenEntity {
    id: string;
    token: string;
    userId: string;
    type: TokenType;
    expires: Date;
    blacklisted: boolean;
    createdAt: Date;
    updatedAt: Date;
}