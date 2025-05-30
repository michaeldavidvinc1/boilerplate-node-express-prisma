import express from "express";
import {UserController} from "../controller/user.controller";
import {UserService} from "../services/user.service";
import {UserRepository} from "../repository/user.repository";

export const userRouter = express.Router();

const userRepository =  new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post("/user/create", userController.createUser);
userRouter.get("/user", userController.getAllUser);
userRouter.get("/user/:id", userController.getSingleUser);
userRouter.put("/user/:id", userController.updateUser);
userRouter.delete("/user/:id", userController.deleteUser);
