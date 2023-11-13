import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
}

const config: DatabaseConfig = {
  username: process.env.DB_USERNAME ?? "username",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_NAME ?? "one_assets_and_alerts",
  host: process.env.DB_HOST_WRITER ?? "localhost",
};

const all: Record<string, DatabaseConfig> = {
  development: config,
  test: config,
  staging: config,
  production: config,
  dev: config,
  stg: config,
  prd: config,
};

export = all;
