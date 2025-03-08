import { HTTP_UNAUTHORIZED } from "../../helper/httpStatusCodes";
import ApiError from "../../utils/apiError";
import { AuthValidation } from "../../validation/authValidation";
import { Validation } from "../../validation/validation";
import { TokenService } from "./tokenService";
import bcrypt from "bcrypt";
import { UserRepository } from "../repository/userRepository";
import {ILoginRequest, LoginResponse} from "../../interface/authInterface";

export class AuthService {
    static async login(req: ILoginRequest): Promise<LoginResponse> {
        const loginRequest = Validation.validate(AuthValidation.LOGIN, req);

        const user = await UserRepository.getUserByEmail(loginRequest.email);

        if (!user) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Incorrect email or password");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Incorrect email or password");
        }

        const tokens = await TokenService.generateAuthToken(user.id);

        return { user, tokens };
    }
}
