import dotenv from "dotenv";

dotenv.config();

import * as pack from "../package.json";
import { router } from "./routes";
import { logger } from "./utils/logger";
import createApp from "./create-app";
import startServer from "./start-server";

export const version = pack.version.substr(0, pack.version.indexOf("."));
export const versionPrefix = `v${version}`;
export const serviceName = pack.name;

export const apiPath = `/api/v1`;

logger.info("------------------------------------------------");
logger.info(`${serviceName}`);
logger.info(`version  : ${version}`);
logger.info(`appEnv   : ${process.env.NODE_ENV ?? ""}`);
logger.info(`logLevel : ${process.env.LOG_LEVEL ?? "-"}`);
logger.info(`pod      : ${process.env.POD_IP ?? "-"}`);
logger.info(`pid      : ${process.pid}`);
logger.info("------------------------------------------------");

const app = createApp(apiPath, router);
startServer(app, apiPath);

export default app;
