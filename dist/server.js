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
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const logger_1 = require("./config/logger");
const config_1 = __importDefault(require("./config/config"));
const checkDatabaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.prismaClient.$connect();
        logger_1.logger.info("Successfully connected to the database");
    }
    catch (error) {
        logger_1.logger.error("Failed to connect to the database", error);
        process.exit(1);
    }
});
// Call function check db
checkDatabaseConnection();
app_1.default.listen(config_1.default.port, () => {
    logger_1.logger.info(`Server running on localhost:${config_1.default.port}`);
});
