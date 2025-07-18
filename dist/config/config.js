"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET || "",
    jwt_expire: process.env.JWT_EXPIRE,
    jwt_refresh_expire: process.env.JWT_REFRESH_EXPIRE
};
exports.default = config;
