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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_1 = require("../../config/db");
class UserRepository {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.user.create({ data: userData });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.user.findFirst({ where: { id } });
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.user.findFirst({ where: { email } });
        });
    }
    updateUser(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.user.update({ where: { id }, data: userData });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.user.delete({ where: { id } });
        });
    }
    getAllUsers(userFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (userFilter.page - 1) * userFilter.size;
            const filters = {};
            if (userFilter.name) {
                filters.name = { contains: userFilter.name };
            }
            if (userFilter.email) {
                filters.email = { contains: userFilter.email };
            }
            const user = yield db_1.prismaClient.user.findMany({
                where: Object.assign({}, filters),
                take: userFilter.size,
                skip,
                orderBy: { createdAt: 'desc' },
            });
            const total = yield db_1.prismaClient.user.count({
                where: Object.assign({}, filters),
            });
            return {
                data: user,
                paging: {
                    current_page: userFilter.page,
                    total_page: Math.ceil(total / userFilter.size),
                    size: userFilter.size,
                },
            };
        });
    }
}
exports.UserRepository = UserRepository;
