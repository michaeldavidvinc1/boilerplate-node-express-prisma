"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoint = void 0;
const express_1 = __importDefault(require("express"));
const users_route_1 = require("./users.route");
const auth_route_1 = require("./auth.route");
exports.endpoint = express_1.default.Router();
exports.endpoint.use("/user", users_route_1.userRouter);
exports.endpoint.use("/auth", auth_route_1.authRouter);
