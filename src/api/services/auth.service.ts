import ApiError from "../../utils/apiError";
import { AuthValidation } from "../../validation/auth.validation";
import { Validation } from "../../validation/validation";
import { TokenService } from "./token.service";
import bcrypt from "bcrypt";
import {AuthResponse, ILoginRequest, IRegisterRequest} from "../../interface/auth.interface";
import {HTTP_CONFLICT, HTTP_UNAUTHORIZED} from "../../constant/data";
import {UserRepositoryImpl} from "../repository/impl/user.repository.impl";
import {TokenRepositoryImpl} from "../repository/impl/token.repository.impl";

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
            throw new ApiError(HTTP_UNAUTHORIZED, "Incorrect email or password");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Incorrect email or password");
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
}
