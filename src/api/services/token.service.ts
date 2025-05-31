import moment from "moment";
import { prismaClient } from "../../config/db";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "../../config/config";
import ApiError from "../../utils/apiError";
import {GenerateToken, TokenResponse} from "../../interface/tokenInterface";
import {HTTP_NOT_FOUND} from "../../constant/data";
import {TokenRepositoryImpl} from "../repository/impl/token.repository.impl";
import {TokenType} from "@prisma/client";

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


  async generateAccessToken(userId: string): Promise<TokenResponse> {
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

    return {
      token: accessToken, expires: accessTokenExpire.toDate()
    };
  }

  async generateRefreshToken(userId: string): Promise<TokenResponse> {
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
      token: refreshToken, expires: refreshTokenExpires.toDate()
    }
  }
}
