
import {HTTP_CONFLICT, HTTP_NOT_FOUND} from "../../helper/httpStatusCodes";
import ApiError from "../../utils/apiError";
import {UserValidation} from "../../validation/userValidation";
import {Validation} from "../../validation/validation";
import bcrypt from "bcrypt";
import {IUser, IUserCreate, IUserSearch, IUserUpdate} from "../../interface/userInterface";
import {UserRepository} from "../repository/userRepository";
import {Pageable} from "../../interface/page";

export class userService {
    static async createUser(userData: IUserCreate): Promise<IUser> {
        const userRequest = Validation.validate(UserValidation.CREATE_USER, userData);

        const existingUser = await UserRepository.getUserByEmail(userRequest.email);

        if (existingUser) {
            throw new ApiError(HTTP_CONFLICT, "This email has already been registered.");
        }

        const hashPassword = await bcrypt.hashSync(userRequest.password, 10);

        const userResult = await UserRepository.createUser({...userRequest, password: hashPassword});

        return userResult;
    }

    static async getAllUsers(userFilter: IUserSearch): Promise<Pageable<IUser>> {
        const searchUser = Validation.validate(UserValidation.SEARCH, userFilter);
        const result = await UserRepository.getAllUsers(searchUser);
        return result;

    }

    static async updateUser(userData: IUserUpdate, id: string): Promise<IUser> {
        const updateUser = Validation.validate(UserValidation.UPDATE_USER, userData);

        const checkExistingData = await UserRepository.getUserById(id)

        if(!checkExistingData){
            throw new ApiError(HTTP_NOT_FOUND, "User not found");
        }

        if (updateUser.password) {
            updateUser.password = await bcrypt.hashSync(updateUser.password, 10);
        }

        const user = await UserRepository.updateUser(id, updateUser);

        return user

    }

    static async deleteUser(id: string): Promise<IUser> {
        const checkExistingData = await UserRepository.getUserById(id)

        if(!checkExistingData){
            throw new ApiError(HTTP_NOT_FOUND, "User not found");
        }

        const user = await UserRepository.deleteUser(id)

        return user;
    }

    static async getSingleUser(id: string): Promise<IUser | null>{
        const checkExistingData = await UserRepository.getUserById(id)

        if(!checkExistingData){
            throw new ApiError(HTTP_NOT_FOUND, "User not found");
        }

        return checkExistingData
    }
}
