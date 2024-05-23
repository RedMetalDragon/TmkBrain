import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
}

export const config: DatabaseConfig = {
  username: process.env.DB_USERNAME ?? "username",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_NAME ?? "db_name",
  host: process.env.DB_HOST_WRITER ?? "localhost",
};

export const allEnv: Record<string, DatabaseConfig> = {
  development: config,
  test: config,
  staging: config,
  production: config,
  dev: config,
  stg: config,
  prd: config,
};
