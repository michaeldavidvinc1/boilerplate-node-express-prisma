import moment from "moment";
import { prismaClient } from "../../config/db";
import { GenerateToken, SaveToken } from "../../model/request/tokenRequest";
import {
    JwtPayload,
  TokenResponse,
  toTokenResponse,
} from "../../model/response/tokenResponse";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import ApiError from "../../utils/apiError";
import { HTTP_NOT_FOUND } from "../../helper/httpStatusCodes";
import { UserResponse } from "../../model/response/userResponse";
import { TokenType } from "@prisma/client";

export class TokenService {
  static async saveToken({
    token,
    userId,
    expires,
    type,
  }: SaveToken): Promise<TokenResponse> {
    const tokenDoc = await prismaClient.token.create({
      data: {
        token,
        userId,
        expires,
        type,
        blacklisted: false,
      },
    });

    return toTokenResponse(tokenDoc);
  }
  static async generateToken({ userId, expires, type, secret }: GenerateToken) {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: Math.floor(expires.getTime() / 1000),
      type,
    };
    const token = jwt.sign(payload, secret);

    return token;
  }
  static async verifyToken(token: string, type: string){
    const payload = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
    const tokenDoc = await prismaClient.token.findFirst({
        where: {
            token,
            type,
            userId: payload.userId,
            blacklisted: false
        }
    })
    if(!tokenDoc){
        throw new ApiError(HTTP_NOT_FOUND, "Token not found")
    }

    return tokenDoc
  }
  static async generateAuthToken(user: UserResponse){
    const accessTokenExpire = moment().add(config.jwt_expire, 'days');
    const accessToken = await this.generateToken({userId: user.id, expires: accessTokenExpire.toDate(), type:TokenType.ACCESS, secret:config.jwt_secret})

    const refreshTokenExpires = moment().add(config.jwt_refresh_expire, 'days');
    const refreshToken = await this.generateToken({userId: user.id, expires: refreshTokenExpires.toDate(), type:TokenType.REFRESH, secret:config.jwt_secret});

    await this.saveToken({token: refreshToken, userId: user.id, expires: refreshTokenExpires.toDate(), type: TokenType.REFRESH, })

    return {
        access: {
          token: accessToken,
          expires: accessTokenExpire.toDate(),
        },
        refresh: {
          token: refreshToken,
          expires: refreshTokenExpires.toDate(),
        },
      };
  }
//   static async deleteToken(token: string, userId: string){
//     const tokenDoc = await prismaClient.token.delete({
//         where: {
//             token,
//             userId
//         }
//     })
//     return tokenDoc
//   }
}
