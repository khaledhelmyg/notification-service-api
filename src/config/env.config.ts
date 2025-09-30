import dotenv from "dotenv";
dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV || "dev",
  APP_PORT:
    process.env.NODE_ENV === "prod"
      ? process.env.LIVE_PORT
      : process.env.TEST_PORT,
  APP_HOST: process.env.APP_HOST,
  // MONGO_URI: process.env.MONGO_URI,
  // MONGO_URI_TEST: process.env.MONGO_URI_TEST,
  // DB_URL:
  //   process.env.NODE_ENV === "prod"
  //     ? process.env.MONGO_URI
  //     : process.env.MONGO_URI_TEST,
  // DB_NAME:
  //   process.env.NODE_ENV === "prod"
  //     ? process.env.DB_NAME
  //     : process.env.DB_NAME_TEST,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
  JWT_PROJECT_KEY: process.env.JWT_PROJECT_KEY,
  FCM_FILE_PATH: process.env.FCM_FILE_PATH,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  DISPLAY_NAME: process.env.DISPLAY_NAME,
  PASSWORD: process.env.PASSWORD,
};
