"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
exports.prismaClient = new client_1.PrismaClient({
    errorFormat: "pretty",
    log: [
        { level: "info", emit: "event" },
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" },
        { level: "query", emit: "event" },
    ],
});
exports.prismaClient.$on("info", (e) => {
    logger_1.logger.info(e.message);
});
exports.prismaClient.$on("warn", (e) => {
    logger_1.logger.warn(e.message);
});
exports.prismaClient.$on("error", (e) => {
    logger_1.logger.error(e.message);
});
exports.prismaClient.$on("query", (e) => {
    logger_1.logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms | Params: ${e.params}`);
});
