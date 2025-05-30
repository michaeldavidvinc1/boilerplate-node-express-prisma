import ApiError from "../../utils/apiError";
import { AuthValidation } from "../../validation/authValidation";
import { Validation } from "../../validation/validation";
import { TokenService } from "./token.service";
import bcrypt from "bcrypt";
import {ILoginRequest, LoginResponse} from "../../interface/authInterface";
import {HTTP_UNAUTHORIZED} from "../../constant/data";
import {UserRepositoryImpl} from "../repository/impl/user.repository.impl";
import {TokenRepositoryImpl} from "../repository/impl/token.repository.impl";

export class AuthService {

    constructor(
        private userRepository: UserRepositoryImpl,
        private tokenService: TokenService,
    ) {}

    async login(req: ILoginRequest): Promise<LoginResponse> {
        const loginRequest = Validation.validate(AuthValidation.LOGIN, req);

        const user = await this.userRepository.getUserByEmail(loginRequest.email);

        if (!user) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Incorrect email or password");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Incorrect email or password");
        }

        const tokens = await this.tokenService.generateAuthToken(user.id);

        return { user, tokens };
    }
}
