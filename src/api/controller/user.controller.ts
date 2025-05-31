import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import {UserService} from "../services/user.service";
import {IUserCreate, IUserSearch, IUserUpdate} from "../../interface/userInterface";
import {HTTP_CREATED, HTTP_OK} from "../../constant/data";
import {logger} from "../../config/logger";

export class UserController {

    constructor(private userService: UserService) {}

    createUser = catchAsync(async(req: Request, res: Response) => {
        const request: IUserCreate = req.body as IUserCreate;
        const result = await this.userService.createUser(request)
        logger.info(`Create user successfully: ${request.email}`);
        res.status(HTTP_CREATED).json({
            success: true,
            message: "Create user successfully",
            data: result
        })
    })
    getAllUser = catchAsync(async(req: Request, res: Response) => {
        const request: IUserSearch = {
            name: (req.query.name as string) || "",
            email: (req.query.email as string) || "",
            page: req.query.page ? Number(req.query.page) : 1,
            size: req.query.size ? Number(req.query.size) : 10,
        };

        const result = await this.userService.getAllUsers(request)
        logger.info(`Get all user successfully`);
        res.status(HTTP_OK).json({
            success: true,
            message: "Getall user successfully",
            data: result
        })
    })
    getSingleUser = catchAsync(async(req: Request, res: Response) => {
        const userId = req.params.id;
        const result = await this.userService.getSingleUser(userId);
        logger.info(`Get single user successfully: ${result}`);
        res.status(HTTP_OK).json({
            success: true,
            message: "Get single user successfully",
            data: result
        })
    })
    updateUser = catchAsync(async(req: Request, res: Response) => {
        const userId = req.params.id;
        const request: IUserUpdate = req.body as IUserUpdate;
        const result = await this.userService.updateUser(request, userId);
        logger.info(`Update user successfully: ${result}`);
        res.status(HTTP_OK).json({
            success: true,
            message: "Update user successfully",
            data: result
        })
    })
    deleteUser = catchAsync(async(req: Request, res: Response) => {
        const userId = req.params.id;
        const result = await this.userService.deleteUser(userId);
        logger.info(`Delete user successfully: ${result}`);
        res.status(HTTP_OK).json({
            success: true,
            message: "Delete user successfully",
            data: result
        })
    })
}