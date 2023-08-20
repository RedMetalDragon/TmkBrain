import express, { Application, Router } from "express";
import compression from "compression";
import cors from "cors";
import httpContext from "express-http-context";

export default function createApp(path: string, router: Router): Application {
  const app: Application = express();

  app.use(compression());
  app.use(cors());
  app.use(httpContext.middleware);
  app.use(path, router);

  return app;
}
