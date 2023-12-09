import type { Sequelize } from "sequelize/types";
import { dbConnectCore, dbConnectCustomer} from "./database/connection";
import { logger } from "./utils/logger";

export default async (): Promise<Sequelize> => {
  try {
    await dbConnectCore.authenticate({ logging: false });
    await dbConnectCustomer.authenticate({ logging: false });

    logger.info("=== Initializing timekeeper models =====");

    //initModelsAssets(dbConnection);

    logger.info(`db      : ${dbConnectCore.getDatabaseName()}`); // TODO if possible, display host too
    logger.info(`db      : ${dbConnectCustomer.getDatabaseName()}`); // TODO if possible, display host too

    logger.info("================================================");

    return dbConnectCore;
  } catch (error) {
    logger.error(error);

    try {
      await dbConnectCore.close();
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
