import type { Sequelize } from "sequelize/types";
import dbConnection from "./database/connection";
import { logger } from "./utils/logger";

export default async (): Promise<Sequelize> => {
  try {
    await dbConnection.authenticate({ logging: false });

    logger.info("=== Initializing timekeeper models =====");

    //initModelsAssets(dbConnection);

    logger.info(`db      : ${dbConnection.getDatabaseName()}`); // TODO if possible, display host too

    logger.info("================================================");

    return dbConnection;
  } catch (error) {
    logger.error(error);

    try {
      await dbConnection.close();
    } catch (closeError) {
      let errorMessage = "";

      if (closeError instanceof Error) {
        errorMessage = closeError.stack ?? closeError.message;
      } else {
        errorMessage = String(closeError);
      }

      logger.error(`Failed closing connection on error\n${errorMessage}`);
    }

    throw error;
  }
};
