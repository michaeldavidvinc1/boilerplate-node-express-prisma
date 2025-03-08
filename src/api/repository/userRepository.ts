import {IUser, IUserCreate, IUserSearch, IUserUpdate} from "../../interface/userInterface";
import {prismaClient} from "../../config/db";
import {Pageable} from "../../interface/page";

export class UserRepository {
    static async createUser(userData: IUserCreate): Promise<IUser> {
        return prismaClient.user.create({data: userData})
    }
    static async getUserById(id: string): Promise<IUser | null> {
        return prismaClient.user.findFirst({where: {id}})
    }
    static async getUserByEmail(email: string): Promise<IUser | null> {
        return prismaClient.user.findFirst({where: {email}})
    }
    static async updateUser(id: string, userData: IUserUpdate): Promise<IUser> {
        return prismaClient.user.update({where: {id}, data: userData})
    }
    static async deleteUser(id: string): Promise<IUser> {
        return prismaClient.user.delete({where: {id}})
    }
    static async getAllUsers(userFilter: IUserSearch): Promise<Pageable<IUser>> {
        const skip = (userFilter.page - 1) * userFilter.size;
        const filters: Record<string, unknown> = {};

        if (userFilter.name) {
            filters.name = {contains: userFilter.name};
        }
        if (userFilter.email) {
            filters.email = {contains: userFilter.email};
        }

        const user = await prismaClient.user.findMany({
            where: {...filters},
            take: userFilter.size,
            skip,
            orderBy: { createdAt: 'desc' },
        });

        const total = await prismaClient.user.count({
            where: {...filters},
        });

        return {
            data: user,
            paging: {
                current_page: userFilter.page,
                total_page: Math.ceil(total / userFilter.size),
                size: userFilter.size,
            },
        };
    }
}