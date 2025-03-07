import { z, ZodType } from "zod";

export class UserValidation {
  static readonly CREATE_USER: ZodType = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().min(8),
  });
  static readonly SEARCH: ZodType = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    status: z.string().optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
  static readonly UPDATE_USER: ZodType = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().min(1).optional(),
    password: z.string().min(8).optional(),
  });
}
