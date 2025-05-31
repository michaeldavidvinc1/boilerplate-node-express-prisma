import express from "express";
import {UserController} from "../controller/user.controller";
import {UserService} from "../services/user.service";
import {UserRepository} from "../repository/user.repository";
import authenticate from "../../middleware/authenticate";

export const userRouter = express.Router();

const userRepository =  new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post("/create", authenticate, userController.createUser);
userRouter.get("/", authenticate, userController.getAllUser);
userRouter.get("/:id", authenticate, userController.getSingleUser);
userRouter.put("/:id", authenticate, userController.updateUser);
userRouter.delete("/:id", authenticate, userController.deleteUser);
