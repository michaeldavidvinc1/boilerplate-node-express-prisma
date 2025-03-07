import { HTTP_UNAUTHORIZED } from "../../helper/httpStatusCodes";
import { LoginRequest } from "../../model/request/authRequest";
import ApiError from "../../utils/apiError";
import { AuthValidation } from "../../validation/authValidation";
import { Validation } from "../../validation/validation";
import { TokenService } from "./tokenService";
import { userService } from "./userService";
import bcrypt from "bcrypt";

export class AuthService {
    static async login(req: LoginRequest){
        const loginRequest = Validation.validate(AuthValidation.LOGIN, req);

        const user = await userService.getUserByEmail(loginRequest.email)

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)

        if(!isPasswordValid){
            throw new ApiError(HTTP_UNAUTHORIZED, "Incorrect email or password")
        }

        const tokens = await TokenService.generateAuthToken(user);

        return {
            user,
            tokens
        }

    }
}