"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_1 = require("./middleware/error");
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = require("./api/routes");
const app = (0, express_1.default)();
// parse json request body
app.use(express_1.default.json());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// parse cookie
app.use((0, cookie_parser_1.default)());
// enable cors
app.use((0, cors_1.default)({ credentials: true }));
app.options("*", (0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use("/api/v1", routes_1.endpoint);
// convert error to ApiError, if needed
app.use(error_1.errorConverter);
// handle error
app.use(error_1.errorHandler);
exports.default = app;
