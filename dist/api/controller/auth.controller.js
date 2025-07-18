"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const data_1 = require("../../constant/data");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.login = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const request = req.body;
            const result = yield this.authService.login(request);
            res.status(data_1.HTTP_OK).json({
                success: true,
                message: "Login successfully",
                data: result
            });
        }));
        this.register = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const request = req.body;
            const result = yield this.authService.register(request);
            res.status(data_1.HTTP_OK).json({
                success: true,
                message: "Register successfully",
                data: result
            });
        }));
        this.refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const request = req.body.refreshToken;
            const result = yield this.authService.refreshToken(request);
            res.status(data_1.HTTP_OK).json({
                success: true,
                message: "Refresh token successfully",
                data: result
            });
        }));
    }
}
exports.AuthController = AuthController;
