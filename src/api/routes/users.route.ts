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

userRouter.post("/create", authenticate, rateLimiter, userController.createUser);
userRouter.get("/", authenticate, rateLimiter, userController.getAllUser);
userRouter.get("/:id", authenticate, rateLimiter, userController.getSingleUser);
userRouter.put("/:id", authenticate, rateLimiter, userController.updateUser);
userRouter.delete("/:id", authenticate, rateLimiter, userController.deleteUser);
