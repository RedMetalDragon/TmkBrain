import type { Sequelize } from "sequelize/types";
import { dbConnect } from "./database/connection";
import { logger } from "./utils/logger";

export default async (): Promise<Sequelize> => {
  try {
    await dbConnect.authenticate({ logging: false });

    logger.info("=== Initializing timekeeper models =====");

    //initModelsAssets(dbConnection);

    logger.info(`db      : ${dbConnect.getDatabaseName()}`);

    logger.info("================================================");

    return dbConnect;
  } catch (error) {
    logger.error(error);

    try {
      await dbConnect.close();
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
