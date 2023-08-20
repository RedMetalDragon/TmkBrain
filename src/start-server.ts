import http from "http";
import { Application } from "express";
import { logger } from "./utils/logger";
import { parse } from "yaml";
import { serve, setup } from "swagger-ui-express";
import { readFileSync } from "fs";

export type Server = http.Server;

export default function startServer(app: Application, apiPath: string): Server {
  const restPort = process.env.PORT ?? 3000;

  const server: Server = http.createServer(app).listen(restPort, () => {
    logger.info(`rest    : http://localhost:${restPort}${apiPath}`);

    logger.info("================================================");
  });

  const file: string = readFileSync("./dist/openapi.yaml", "utf-8");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const swaggerDoc = parse(file);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use("/api/v1/api-docs", serve, setup(swaggerDoc));

  return server;
}
