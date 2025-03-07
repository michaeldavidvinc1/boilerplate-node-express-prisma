import { Token } from "@prisma/client";

export interface TokenResponse {
  token: string;
  userId: string;
  type: string;
  expires: Date;
}

export interface JwtPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
  }

export function toTokenResponse(token: Token): TokenResponse {
  return {
    token: token.token,
    userId: token.userId,
    type: token.type,
    expires: token.expires,
  };
}
