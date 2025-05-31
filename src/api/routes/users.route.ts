import express from "express";
import {UserController} from "../controller/user.controller";
import {UserService} from "../services/user.service";
import {UserRepository} from "../repository/user.repository";

export const userRouter = express.Router();

const userRepository =  new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post("/create", userController.createUser);
userRouter.get("/", userController.getAllUser);
userRouter.get("/:id", userController.getSingleUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);
