import { cleanEnv, port, str } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    PORT: port(),
    SESSION_SECRET: str(),
  });
}

export default validateEnv;
