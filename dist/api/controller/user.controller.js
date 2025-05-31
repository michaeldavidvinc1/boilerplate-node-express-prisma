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
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const data_1 = require("../../constant/data");
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.createUser = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const request = req.body;
            const result = yield this.userService.createUser(request);
            res.status(data_1.HTTP_CREATED).json({
                success: true,
                message: "Create user successfully",
                data: result
            });
        }));
        this.getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                name: req.query.name || "",
                email: req.query.email || "",
                page: req.query.page ? Number(req.query.page) : 1,
                size: req.query.size ? Number(req.query.size) : 10,
            };
            const result = yield this.userService.getAllUsers(request);
            res.status(data_1.HTTP_OK).json({
                success: true,
                message: "Getall user successfully",
                data: result
            });
        }));
        this.getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const result = yield this.userService.getSingleUser(userId);
            res.status(data_1.HTTP_OK).json({
                success: true,
                message: "Get single user successfully",
                data: result
            });
        }));
        this.updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const request = req.body;
            const result = yield this.userService.updateUser(request, userId);
            res.status(data_1.HTTP_OK).json({
                success: true,
                message: "Update user successfully",
                data: result
            });
        }));
        this.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const result = yield this.userService.deleteUser(userId);
            res.status(data_1.HTTP_OK).json({
                success: true,
                message: "Delete user successfully",
                data: result
            });
        }));
    }
}
exports.UserController = UserController;
