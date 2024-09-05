import type { Sequelize } from "sequelize/types";

import type { Server } from "../start-server";
import { logger } from "./logger";

type ErrorOrNull = Error | null;
type ErrorOrUndefined = Error | undefined;

function sigterm(server: Server, dbConnection: Sequelize): void {
  logger.info("Received SIGTERM. Initiating graceful shutdown…");
  sigtermHelper(server, dbConnection);
}

function sigtermHelper(server: Server, dbConnection: Sequelize): void {
  dbConnection
    /* eslint-disable-next-line  @typescript-eslint/no-unnecessary-condition */
    ?.close()
    .catch((error: ErrorOrNull) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      logger.error(`Received error closing db connection: ${error!.message}`)
    );

  server.getConnections((error: ErrorOrNull, count: number) => {
    if (error) {
      logger.error(`Received error getting open connections: ${error.message}`);
    }
    if (count > 0) {
      logger.warn(`Connections still open: ${count}`);
      setTimeout(() => {
        sigtermHelper(server, dbConnection);
      }, 5000);
    } else {
      server.close((e?: ErrorOrUndefined) => {
        if (typeof e !== "undefined") {
          logger.error(e);
          return process.exit(1);
        }
        logger.info("No open connections. Closing gracefully.");
        return process.exit(0);
      });
    }
  });
}

export { sigterm };
