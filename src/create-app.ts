import express, { Application, Router } from "express";
import compression from "compression";
import cors from "cors";
import httpContext from "express-http-context";
import bodyParser from "body-parser";
import { problemDetailsResponseMiddleware } from "./middleware/problem-details-response";

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

export default function createApp(path: string, router: Router): Application {
  const app: Application = express();

  app.use(compression());
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(httpContext.middleware);
  app.use(path, router);
  app.use(problemDetailsResponseMiddleware);
  return app;
}
