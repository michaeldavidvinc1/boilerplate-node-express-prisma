import {IUser, IUserCreate, IUserSearch, IUserUpdate} from "../../../interface/userInterface";
import {Pageable} from "../../../interface/page";

export interface UserRepositoryImpl {
    createUser(userData: IUserCreate): Promise<IUser>;
    getUserById(id: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    updateUser(id: string, userData: IUserUpdate): Promise<IUser>;
    deleteUser(id: string): Promise<IUser>;
    getAllUsers(userFilter: IUserSearch): Promise<Pageable<IUser>>;
}