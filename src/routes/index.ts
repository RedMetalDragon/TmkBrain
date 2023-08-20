import { Router } from "express";
import {
  HealthCheckRestHandler,
} from "../handlers";

const router = Router();

// Health Check
router.get("/health-check", HealthCheckRestHandler.healthCheck);

export { router };
