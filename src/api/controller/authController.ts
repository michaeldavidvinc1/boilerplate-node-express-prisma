import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "../services/authService";
import { HTTP_OK } from "../../helper/httpStatusCodes";
import {ILoginRequest} from "../../interface/authInterface";

export class AuthController {
    static login = catchAsync(async(req: Request, res: Response) => {
        const request: ILoginRequest = req.body as ILoginRequest;
        const result = await AuthService.login(request)
        res.status(HTTP_OK).json({
            success: true,
            message: "Login successfully",
            data: result
        })
    })
}