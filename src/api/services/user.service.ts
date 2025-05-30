
import ApiError from "../../utils/apiError";
import {UserValidation} from "../../validation/userValidation";
import {Validation} from "../../validation/validation";
import bcrypt from "bcrypt";
import {IUser, IUserCreate, IUserSearch, IUserUpdate} from "../../interface/userInterface";
import {UserRepository} from "../repository/user.repository";
import {Pageable} from "../../interface/page";
import {HTTP_CONFLICT, HTTP_NOT_FOUND} from "../../constant/data";
import {UserRepositoryImpl} from "../repository/impl/user.repository.impl";

export class UserService {

    constructor(private userRepository: UserRepositoryImpl) {}

    async createUser(userData: IUserCreate): Promise<IUser> {
        const userRequest = Validation.validate(UserValidation.CREATE_USER, userData);

        const existingUser = await this.userRepository.getUserByEmail(userRequest.email);

        if (existingUser) {
            throw new ApiError(HTTP_CONFLICT, "This email has already been registered.");
        }

        const hashPassword = await bcrypt.hashSync(userRequest.password, 10);

        const userResult = await this.userRepository.createUser({...userRequest, password: hashPassword});

        return userResult;
    }

    async getAllUsers(userFilter: IUserSearch): Promise<Pageable<IUser>> {
        const searchUser = Validation.validate(UserValidation.SEARCH, userFilter);
        const result = await this.userRepository.getAllUsers(searchUser);
        return result;

    }

    async updateUser(userData: IUserUpdate, id: string): Promise<IUser> {
        const updateUser = Validation.validate(UserValidation.UPDATE_USER, userData);

        const checkExistingData = await this.userRepository.getUserById(id)

        if(!checkExistingData){
            throw new ApiError(HTTP_NOT_FOUND, "User not found");
        }

        if (updateUser.password) {
            updateUser.password = await bcrypt.hashSync(updateUser.password, 10);
        }

        const user = await this.userRepository.updateUser(id, updateUser);

        return user

    }

    async deleteUser(id: string): Promise<IUser> {
        const checkExistingData = await this.userRepository.getUserById(id)

        if(!checkExistingData){
            throw new ApiError(HTTP_NOT_FOUND, "User not found");
        }

        const user = await this.userRepository.deleteUser(id)

        return user;
    }

    async getSingleUser(id: string): Promise<IUser | null>{
        const checkExistingData = await this.userRepository.getUserById(id)

        if(!checkExistingData){
            throw new ApiError(HTTP_NOT_FOUND, "User not found");
        }

        return checkExistingData
    }
}
