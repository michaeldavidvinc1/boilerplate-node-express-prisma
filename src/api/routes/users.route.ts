import express from "express";
import {UserController} from "../controller/user.controller";
import {UserService} from "../services/user.service";
import {UserRepository} from "../repository/user.repository";
import authenticate from "../../middleware/authenticate";
import rateLimiter from "../../middleware/rate.limiter";

export const userRouter = express.Router();

const userRepository =  new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post("/create", rateLimiter, authenticate, userController.createUser);
userRouter.get("/", rateLimiter, authenticate, userController.getAllUser);
userRouter.get("/:id",  rateLimiter, authenticate, userController.getSingleUser);
userRouter.put("/:id", rateLimiter, authenticate, userController.updateUser);
userRouter.delete("/:id", rateLimiter, authenticate, userController.deleteUser);
