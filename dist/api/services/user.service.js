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
exports.UserService = void 0;
const apiError_1 = __importDefault(require("../../utils/apiError"));
const user_validation_1 = require("../../validation/user.validation");
const validation_1 = require("../../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_1 = require("../../constant/data");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRequest = validation_1.Validation.validate(user_validation_1.UserValidation.CREATE_USER, userData);
            const existingUser = yield this.userRepository.getUserByEmail(userRequest.email);
            if (existingUser) {
                throw new apiError_1.default(data_1.HTTP_CONFLICT, "This email has already been registered.");
            }
            const hashPassword = yield bcrypt_1.default.hashSync(userRequest.password, 10);
            const userResult = yield this.userRepository.createUser(Object.assign(Object.assign({}, userRequest), { password: hashPassword }));
            return userResult;
        });
    }
    getAllUsers(userFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchUser = validation_1.Validation.validate(user_validation_1.UserValidation.SEARCH, userFilter);
            const result = yield this.userRepository.getAllUsers(searchUser);
            return result;
        });
    }
    updateUser(userData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUser = validation_1.Validation.validate(user_validation_1.UserValidation.UPDATE_USER, userData);
            const checkExistingData = yield this.userRepository.getUserById(id);
            if (!checkExistingData) {
                throw new apiError_1.default(data_1.HTTP_NOT_FOUND, "User not found");
            }
            if (updateUser.password) {
                updateUser.password = yield bcrypt_1.default.hashSync(updateUser.password, 10);
            }
            const user = yield this.userRepository.updateUser(id, updateUser);
            return user;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkExistingData = yield this.userRepository.getUserById(id);
            if (!checkExistingData) {
                throw new apiError_1.default(data_1.HTTP_NOT_FOUND, "User not found");
            }
            const user = yield this.userRepository.deleteUser(id);
            return user;
        });
    }
    getSingleUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkExistingData = yield this.userRepository.getUserById(id);
            if (!checkExistingData) {
                throw new apiError_1.default(data_1.HTTP_NOT_FOUND, "User not found");
            }
            return checkExistingData;
        });
    }
}
exports.UserService = UserService;
