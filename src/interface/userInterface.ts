export interface IUser {
    id: string;
    email: string;
    password: string;
    role: string;
    name: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserSearch {
    name?: string;
    email?: string;
    page: number;
    size: number;
}

export interface IUserCreate {
    email: string;
    password: string;
    name: string;
}

export interface IUserUpdate {
    email?: string;
    password?: string;
    name?: string;
}