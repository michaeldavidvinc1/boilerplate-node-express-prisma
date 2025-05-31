import winston from "winston";
import config from "./config";

const enumerateErrorFormat = winston.format((info: winston.Logform.TransformableInfo) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
      enumerateErrorFormat(),
      config.env === "development"
          ? winston.format.colorize()
          : winston.format.uncolorize(),
      winston.format.splat(),
      winston.format.printf(({ level, message, timestamp }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});
