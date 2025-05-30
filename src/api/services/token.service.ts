import moment from "moment";
import { prismaClient } from "../../config/db";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "../../config/config";
import ApiError from "../../utils/apiError";
import { TokenType } from "@prisma/client";
import {AuthTokenResponse, GenerateToken, SaveToken, TokenResponse} from "../../interface/tokenInterface";
import {HTTP_NOT_FOUND} from "../../constant/data";
import {TokenRepositoryImpl} from "../repository/impl/token.repository.impl";

export class TokenService {

  constructor(private tokenRepository: TokenRepositoryImpl) {}

  async generateToken({ userId, expires, type, secret }: GenerateToken): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      iat: moment().unix(),
      exp: Math.floor(expires.getTime() / 1000),
      type,
    };
    return jwt.sign(payload, secret);
  }


  async generateAuthToken(userId: string): Promise<AuthTokenResponse> {
    const accessTokenExpire = moment().add(config.jwt_expire, "days");
    const accessToken = await this.generateToken({
      userId,
      expires: accessTokenExpire.toDate(),
      type: TokenType.ACCESS,
      secret: config.jwt_secret,
    });

    await this.tokenRepository.create({
      token: accessToken,
      userId,
      expires: accessTokenExpire.toDate(),
      type: TokenType.ACCESS,
    })

    const refreshTokenExpires = moment().add(config.jwt_refresh_expire, "days");
    const refreshToken = await this.generateToken({
      userId,
      expires: refreshTokenExpires.toDate(),
      type: TokenType.REFRESH,
      secret: config.jwt_secret,
    });

    await this.tokenRepository.create({
      token: refreshToken,
      userId,
      expires: refreshTokenExpires.toDate(),
      type: TokenType.REFRESH,
    })

    return {
      access: { token: accessToken, expires: accessTokenExpire.toDate() },
      refresh: { token: refreshToken, expires: refreshTokenExpires.toDate() },
    };
  }
}
