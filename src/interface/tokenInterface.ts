export interface GenerateToken {
    userId: string;
    expires: Date;
    type: string;
    secret: string;
}

export interface TokenResponse {
    token: string;
    expires: Date;
}

