import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import cls from "cls-hooked";

import { allCore, allCustomer } from "./config";
import { logger } from "../utils/logger";

dotenv.config();

/* eslint-disable-next-line */
const namespace = cls.createNamespace("timekeeper");

const env: string = process.env.NODE_ENV ?? "development";
const confCore = allCore[env];
const confCustomer = allCustomer[env];

Sequelize.useCLS(namespace);

export const dbConnectCore = new Sequelize(
  confCore?.database as string,
  confCore?.username as string,
  confCore?.password as string,
  {
    host: confCore?.host as string,
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
    logging: (sql) => {
      logger.debug(`Query: ${sql}}`);
    },
  },
);

export const dbConnectCustomer = new Sequelize(
  confCustomer?.database as string,
  confCustomer?.username as string,
  confCustomer?.password as string,
  {
    host: confCustomer?.host as string,
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
    logging: (sql) => {
      logger.debug(`Query: ${sql}}`);
    },
  },
);