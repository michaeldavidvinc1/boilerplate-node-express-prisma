import { Request, Response } from "express";
import { LoginRequest } from "../../model/request/authRequest";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "../services/authService";
import { HTTP_OK } from "../../helper/httpStatusCodes";

export class AuthController {
    static login = catchAsync(async(req: Request, res: Response) => {
        const request: LoginRequest = req.body as LoginRequest;
        const result = await AuthService.login(request)
        res.status(HTTP_OK).json({
            success: true,
            message: "Login successfully",
            data: result
        })
    })
}