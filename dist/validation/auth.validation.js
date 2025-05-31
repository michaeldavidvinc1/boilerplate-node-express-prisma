"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
class AuthValidation {
}
exports.AuthValidation = AuthValidation;
AuthValidation.LOGIN = zod_1.z.object({
    email: zod_1.z.string().email().min(1),
    password: zod_1.z.string().min(8),
});
AuthValidation.REGISTER = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email().min(1),
    password: zod_1.z.string().min(8),
});
