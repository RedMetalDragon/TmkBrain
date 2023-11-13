import { Dialect, Model, Sequelize } from "sequelize";
import dotenv from "dotenv";
import cls from "cls-hooked";

import config from "./config";
import { logger } from "../utils/logger";

dotenv.config();

/* eslint-disable-next-line */
const namespace = cls.createNamespace("dtn-one-alerts-api");

const env: string = process.env.NODE_ENV ?? "development";
const conf = config[env];

Sequelize.useCLS(namespace);

export default new Sequelize(
  conf?.database as string,
  conf?.username as string,
  conf?.password as string,
  {
    host: conf?.host as string,
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
    logging: (sql) => {
      logger.debug(`Query: ${sql}}`);
    },
  },
);