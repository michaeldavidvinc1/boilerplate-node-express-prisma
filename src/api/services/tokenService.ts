import moment from "moment";
import { prismaClient } from "../../config/db";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "../../config/config";
import ApiError from "../../utils/apiError";
import { HTTP_NOT_FOUND } from "../../helper/httpStatusCodes";
import { TokenType } from "@prisma/client";
import {AuthTokenResponse, GenerateToken, SaveToken, TokenResponse} from "../../interface/tokenInterface";

export class TokenService {
  static async saveToken({ token, userId, expires, type }: SaveToken): Promise<TokenResponse> {
    const tokenDoc = await prismaClient.token.create({
      data: {
        token,
        userId,
        expires,
        type,
        blacklisted: false,
      },
    });

    return { token: tokenDoc.token, expires: tokenDoc.expires };
  }

  static async generateToken({ userId, expires, type, secret }: GenerateToken): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      iat: moment().unix(),
      exp: Math.floor(expires.getTime() / 1000),
      type,
    };
    return jwt.sign(payload, secret);
  }

  static async verifyToken(token: string, type: string) {
    const payload = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
    const tokenDoc = await prismaClient.token.findFirst({
      where: {
        token,
        type,
        userId: payload.sub,
        blacklisted: false,
      },
    });

    if (!tokenDoc) {
      throw new ApiError(HTTP_NOT_FOUND, "Token not found");
    }

    return tokenDoc;
  }

  static async generateAuthToken(userId: string): Promise<AuthTokenResponse> {
    const accessTokenExpire = moment().add(config.jwt_expire, "days");
    const accessToken = await this.generateToken({
      userId,
      expires: accessTokenExpire.toDate(),
      type: TokenType.ACCESS,
      secret: config.jwt_secret,
    });

    const refreshTokenExpires = moment().add(config.jwt_refresh_expire, "days");
    const refreshToken = await this.generateToken({
      userId,
      expires: refreshTokenExpires.toDate(),
      type: TokenType.REFRESH,
      secret: config.jwt_secret,
    });

    await this.saveToken({
      token: refreshToken,
      userId,
      expires: refreshTokenExpires.toDate(),
      type: TokenType.REFRESH,
    });

    return {
      access: { token: accessToken, expires: accessTokenExpire.toDate() },
      refresh: { token: refreshToken, expires: refreshTokenExpires.toDate() },
    };
  }
}
