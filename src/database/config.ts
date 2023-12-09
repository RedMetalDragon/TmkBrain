import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
}

export const configCore: DatabaseConfig = {
  username: process.env.DB_USERNAME ?? "username",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_NAME ?? "db_name",
  host: process.env.DB_HOST_WRITER ?? "localhost",
};

export const configCustomer: DatabaseConfig = {
  username: process.env.DB_USERNAME ?? "username",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_NAME_CUSTOMER ?? "db_name",
  host: process.env.DB_HOST_WRITER ?? "localhost",
};

export const allCore: Record<string, DatabaseConfig> = {
  development: configCore,
  test: configCore,
  staging: configCore,
  production: configCore,
  dev: configCore,
  stg: configCore,
  prd: configCore,
};

export const allCustomer: Record<string, DatabaseConfig> = {
  development: configCustomer,
  test: configCustomer,
  staging: configCustomer,
  production: configCustomer,
  dev: configCustomer,
  stg: configCustomer,
  prd: configCustomer,
};
