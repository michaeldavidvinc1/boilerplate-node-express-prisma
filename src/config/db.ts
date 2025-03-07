import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

export const prismaClient = new PrismaClient({
  errorFormat: "pretty",
  log: [
    { level: "info", emit: "event" },
    { level: "warn", emit: "event" },
    { level: "error", emit: "event" },
    { level: "query", emit: "event" },
  ],
});

prismaClient.$on("info", (e: { timestamp: Date; message: string }) => {
  logger.info(e.message);
});

prismaClient.$on("warn", (e: { timestamp: Date; message: string }) => {
  logger.warn(e.message);
});

prismaClient.$on("error", (e: { timestamp: Date; message: string }) => {
  logger.error(e.message);
});

prismaClient.$on("query", (e: { timestamp: Date; query: string; duration: number; params: string }) => {
  logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms | Params: ${e.params}`);
});
