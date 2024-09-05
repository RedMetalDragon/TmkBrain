import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import cls from "cls-hooked";

import { allEnv } from "./config";
import { logger } from "../utils/logger";

dotenv.config();

/* eslint-disable-next-line */
const namespace = cls.createNamespace("timekeeper");

const env: string = process.env.NODE_ENV ?? "development";
const conf = allEnv[env];

Sequelize.useCLS(namespace);

export const dbConnect = new Sequelize(
  conf?.database as string,
  conf?.username as string,
  conf?.password as string,
  {
    host: conf?.host as string,
    dialect: "mysql",
    define: {
      freezeTableName: true,
    },
    logging: (sql) => {
      logger.debug(`Query: ${sql}}`);
    },
  }
);
