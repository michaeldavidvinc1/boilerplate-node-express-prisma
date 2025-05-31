import { z, ZodType } from "zod";

export class AuthValidation {
  static readonly LOGIN: ZodType = z.object({
    email: z.string().email().min(1),
    password: z.string().min(8),
  });
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().min(8),
  });
}
