import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwt_secret: process.env.JWT_SECRET || "",
  jwt_expire: process.env.JWT_EXPIRE,
  jwt_refresh_expire: process.env.JWT_REFRESH_EXPIRE
};

export default config;
