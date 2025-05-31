import express from "express";
import {userRouter} from "./users.route";
import {AuthController} from "../controller/auth.controller";
import {AuthService} from "../services/auth.service";
import {UserRepository} from "../repository/user.repository";
import {TokenService} from "../services/token.service";
import {TokenRepository} from "../repository/token.repository";
import rateLimiter from "../../middleware/rate.limiter";

export const authRouter = express.Router();

const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();
const tokenService = new TokenService(tokenRepository)
const authService = new AuthService(userRepository, tokenService, tokenRepository)
const authController = new AuthController(authService)

authRouter.post("/login", rateLimiter, authController.login);
authRouter.post("/register", rateLimiter, authController.register);
authRouter.post("/refresh-token", rateLimiter, authController.refreshToken);