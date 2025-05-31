import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "../services/auth.service";
import {ILoginRequest, IRegisterRequest} from "../../interface/auth.interface";
import {HTTP_OK} from "../../constant/data";
import {logger} from "../../config/logger";

export class AuthController {

    constructor(private authService: AuthService) {}

    login = catchAsync(async(req: Request, res: Response) => {
        const request: ILoginRequest = req.body as ILoginRequest;
        const result = await this.authService.login(request)
        logger.info(`Login success for email: ${request.email}`);
        res.status(HTTP_OK).json({
            success: true,
            message: "Login successfully",
            data: result
        })
    })

    register = catchAsync(async(req: Request, res: Response) => {
        const request: IRegisterRequest = req.body as IRegisterRequest;
        const result = await this.authService.register(request)
        logger.info(`Registration success for email: ${request.email}`);
        res.status(HTTP_OK).json({
            success: true,
            message: "Register successfully",
            data: result
        })
    })

    refreshToken = catchAsync(async(req: Request, res: Response) => {
        const request = req.body.refreshToken;
        const result = await this.authService.refreshToken(request);
        logger.info(`Refresh token success`);
        res.status(HTTP_OK).json({
            success: true,
            message: "Refresh token successfully",
            data: result
        })
    })
}