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

// Log untuk event info, warn, error, dan query
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

// Fungsi untuk menghubungkan ke database dan menangani error
export const connectToDatabase = async () => {
  try {
    await prismaClient.$connect();
    logger.info("Successfully connected to the database");
  } catch (error) {
    logger.error("Failed to connect to the database", error);
    process.exit(1); // Keluar dari aplikasi jika gagal terhubung
  }
};

// Fungsi untuk memutuskan koneksi dari database
export const disconnectFromDatabase = async () => {
  try {
    await prismaClient.$disconnect();
    logger.info("Successfully disconnected from the database");
  } catch (error) {
    logger.error("Failed to disconnect from the database", error);
  }
};