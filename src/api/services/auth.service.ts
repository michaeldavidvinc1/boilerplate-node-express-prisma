import ApiError from "../../utils/apiError";
import { AuthValidation } from "../../validation/auth.validation";
import { Validation } from "../../validation/validation";
import { TokenService } from "./token.service";
import bcrypt from "bcrypt";
import {AuthResponse, ILoginRequest, IRegisterRequest} from "../../interface/auth.interface";
import {HTTP_CONFLICT, HTTP_FORBIDDEN, HTTP_NOT_FOUND, HTTP_UNAUTHORIZED} from "../../constant/data";
import {UserRepositoryImpl} from "../repository/impl/user.repository.impl";
import {TokenRepositoryImpl} from "../repository/impl/token.repository.impl";
import moment from "moment";

export class AuthService {

    constructor(
        private userRepository: UserRepositoryImpl,
        private tokenService: TokenService,
        private tokenRepository: TokenRepositoryImpl
    ) {}

    async login(req: ILoginRequest): Promise<AuthResponse> {
        const loginRequest = Validation.validate(AuthValidation.LOGIN, req);

        const user = await this.userRepository.getUserByEmail(loginRequest.email);

        if (!user) {
            throw new ApiError(HTTP_FORBIDDEN, "Incorrect email or password");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new ApiError(HTTP_FORBIDDEN, "Incorrect email or password");
        }

        const checkTokenExists = await this.tokenRepository.getTokenByUserId(user.id);

        if(checkTokenExists) {
           await this.tokenRepository.deleteAllTokenByUser(user.id);
        }

        const tokenAccess = await this.tokenService.generateAccessToken(user.id);

        const tokenRefresh = await this.tokenService.generateRefreshToken(user.id);

        return {
            user,
            tokens: {
                access: tokenAccess,
                refresh: tokenRefresh,
            }
        };
    }

    async register(req: IRegisterRequest): Promise<AuthResponse> {
        const registerRequest = Validation.validate(AuthValidation.REGISTER, req);

        const checkUser = await this.userRepository.getUserByEmail(registerRequest.email);

        if (checkUser) {
            throw new ApiError(HTTP_CONFLICT, "Email already exists!");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await this.userRepository.createUser(registerRequest);

        const tokenAccess = await this.tokenService.generateAccessToken(user.id);

        const tokenRefresh = await this.tokenService.generateRefreshToken(user.id);

        return {
            user,
            tokens: {
                access: tokenAccess,
                refresh: tokenRefresh,
            }
        };
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const storedRefreshToken = await this.tokenRepository.getTokenRefresh(refreshToken);
        console.info('storedRefreshToken', storedRefreshToken);
        if (!storedRefreshToken) {
            throw new ApiError(HTTP_NOT_FOUND, "Refresh token not found!");
        }

        if (moment().isAfter(moment(storedRefreshToken.expires))) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Session expired. Please login again!");
        }

        const user = await this.userRepository.getUserById(storedRefreshToken.userId);
        console.info('user', user);
        if (!user) {
            throw new ApiError(HTTP_FORBIDDEN, "Token is not valid!");
        }

        const oldAccessToken = await this.tokenRepository.getTokenAccess(user.id);
        console.info('oldAccessToken', oldAccessToken);
        if (oldAccessToken) {
            await this.tokenRepository.deleteToken(oldAccessToken.id, user.id, oldAccessToken.token);
        }

        const newAccessToken = await this.tokenService.generateAccessToken(user.id);
        console.info('newAccessToken', newAccessToken);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            tokens: {
                access: newAccessToken,
                refresh: storedRefreshToken,
            }
        };
    }

}
