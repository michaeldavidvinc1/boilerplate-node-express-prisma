import { TokenType } from "@prisma/client";

export type SaveToken = {
  token: string;
  userId: string;
  type: TokenType;
  expires: Date;
};

export type GenerateToken = {
  userId: string;
  type: TokenType;
  expires: Date;
  secret: string;
};


