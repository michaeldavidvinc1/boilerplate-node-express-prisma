export interface UserEntity {
    id: string;
    email: string;
    password: string;
    role: string;
    name: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}