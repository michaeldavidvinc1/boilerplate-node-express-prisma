import {TokenType} from "@prisma/client";

export interface ITokenCreate {
    token: string;
    userId: string;
    expires: Date;
    type: TokenType;
}