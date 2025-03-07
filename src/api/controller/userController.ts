import { Request, Response } from "express";
import { CreateUserRequest, SearchUser, UpdateUserRequest } from "../../model/request/userRequest";
import catchAsync from "../../utils/catchAsync";
import { userService } from "../services/userService";
import { HTTP_CREATED, HTTP_OK } from "../../helper/httpStatusCodes";

export class UserController {
    static createUser = catchAsync(async(req: Request, res: Response) => {
        const request: CreateUserRequest = req.body as CreateUserRequest;
        const result = await userService.createUser(request)
        res.status(HTTP_CREATED).json({
            success: true,
            message: "Create user successfully",
            data: result
        })
    })
    static getAllUser = catchAsync(async(req: Request, res: Response) => {
        const request: SearchUser = {
            name: (req.query.name as string) || "",
            email: (req.query.email as string) || "",
            page: req.query.page ? Number(req.query.page) : 1,
            size: req.query.size ? Number(req.query.size) : 10,
        };

        const result = await userService.getAllUsers(request)
        res.status(HTTP_OK).json({
            success: true,
            message: "Getall user successfully",
            data: result
        })
    })
    static getSingleUser = catchAsync(async(req: Request, res: Response) => {
        const userId = req.params.id;
        const result = await userService.getUserById(userId);
        res.status(HTTP_OK).json({
            success: true,
            message: "Get single user successfully",
            data: result
        })
    })
    static updateUser = catchAsync(async(req: Request, res: Response) => {
        const userId = req.params.id;
        const request: UpdateUserRequest = req.body as UpdateUserRequest;
        const result = await userService.updateUser(request, userId);
        res.status(HTTP_OK).json({
            success: true,
            message: "Update user successfully",
            data: result
        })
    })
    static deleteUser = catchAsync(async(req: Request, res: Response) => {
        const userId = req.params.id;
        const result = await userService.deleteUser(userId);
        res.status(HTTP_OK).json({
            success: true,
            message: "Delete user successfully",
            data: result
        })
    })
}