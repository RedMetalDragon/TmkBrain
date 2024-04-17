import express, { Application, Router } from "express";
import compression from "compression";
import cors from "cors";
import httpContext from "express-http-context";
import bodyParser from "body-parser";
import { problemDetailsResponseMiddleware } from "./middleware/problem-details-response";

export default function createApp(path: string, router: Router): Application {
  const app: Application = express();

  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(httpContext.middleware);
  app.use(path, router);
  app.use(problemDetailsResponseMiddleware);

  return app;
}
