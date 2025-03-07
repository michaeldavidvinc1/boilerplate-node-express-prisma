import { prismaClient } from "../../config/db";
import { HTTP_CONFLICT, HTTP_NOT_FOUND } from "../../helper/httpStatusCodes";
import {
  CreateUserRequest,
  SearchUser,
  UpdateUserRequest,
} from "../../model/request/userRequest";
import { Pageable } from "../../model/response/page";
import {
  toUserResponse,
  UserResponse,
} from "../../model/response/userResponse";
import ApiError from "../../utils/apiError";
import { UserValidation } from "../../validation/userValidation";
import { Validation } from "../../validation/validation";
import bcrypt from "bcrypt";

export class userService {
  static async getUserById(id: string): Promise<UserResponse> {
    const user = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ApiError(HTTP_NOT_FOUND, "User not found!");
    }

    return toUserResponse(user);
  }
  static async getUserByEmail(email: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError(HTTP_NOT_FOUND, "User not found!");
    }

    return user;
  }
  static async createUser(req: CreateUserRequest): Promise<UserResponse> {
    const userRequest = Validation.validate(UserValidation.CREATE_USER, req);

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: userRequest.email,
      },
    });

    if (existingUser) {
      throw new ApiError(
        HTTP_CONFLICT,
        "This email has already been registered."
      );
    }

    const hashPassword = await bcrypt.hashSync(userRequest.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: userRequest.name,
        email: userRequest.email,
        password: hashPassword,
      },
    });

    return toUserResponse(user);
  }
  static async getAllUsers(req: SearchUser): Promise<Pageable<UserResponse>> {
    const searchUser = Validation.validate(UserValidation.SEARCH, req);

    const skip = (searchUser.page - 1) * searchUser.size;
    const filters: Record<string, unknown> = {};

    if (searchUser.name) {
      filters.name = { contains: searchUser.name };
    }
    if (searchUser.email) {
      filters.email = { contains: searchUser.email };
    }

    const user = await prismaClient.user.findMany({
      where: { ...filters },
      take: searchUser.size,
      skip,
    });

    const total = await prismaClient.user.count({
      where: { ...filters },
    });

    return {
      data: user.map((user) => toUserResponse(user)),
      paging: {
        current_page: searchUser.page,
        total_page: Math.ceil(total / searchUser.size),
        size: searchUser.size,
      },
    };
  }
  static async updateUser(
    req: UpdateUserRequest,
    id: string
  ): Promise<UserResponse> {
    const updateUser = Validation.validate(UserValidation.UPDATE_USER, req);

    await this.getUserById(id);

    if (updateUser.email && (await this.getUserByEmail(updateUser.email))) {
      throw new ApiError(
        HTTP_CONFLICT,
        "This email has already been registered."
      );
    }

    if(updateUser.password){
        updateUser.password = await bcrypt.hashSync(updateUser.password, 10);
    }

    const user = await prismaClient.user.update({
        where: {
            id
        },
        data: updateUser
    })

    return toUserResponse(user)

  }
  static async deleteUser(id: string): Promise<UserResponse>{
    await this.getUserById(id);

    const user = await prismaClient.user.delete({
      where: {
        id
      }
    })

    return toUserResponse(user);
  }
}
