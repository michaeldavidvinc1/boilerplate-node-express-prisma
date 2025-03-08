export interface SaveToken {
    token: string;
    userId: string;
    expires: Date;
    type: string;
}

export interface GenerateToken {
    userId: string;
    expires: Date;
    type: string;
    secret: string;
}

export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
    type: string;
}

export interface TokenResponse {
    token: string;
    expires: Date;
}

export interface AuthTokenResponse {
    access: TokenResponse;
    refresh: TokenResponse;
}
