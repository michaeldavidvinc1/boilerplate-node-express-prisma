"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.CREATE_USER = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email().min(1),
    password: zod_1.z.string().min(8),
});
UserValidation.SEARCH = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).positive(),
});
UserValidation.UPDATE_USER = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().min(1).optional(),
    password: zod_1.z.string().min(8).optional(),
});
