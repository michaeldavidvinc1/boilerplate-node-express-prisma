export interface ILoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    tokens: {
        access: {
            token: string;
            expires: Date;
        };
        refresh: {
            token: string;
            expires: Date;
        };
    };
}
