import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV
};

export default config;
