import { Request, Response } from "express";
import { HealthCheckController } from "../controllers";

const HealthCheckRestHandler = {
  healthCheck(req: Request, res: Response): void {
    res.status(200).json(HealthCheckController.healthCheck());
  },
};

export { HealthCheckRestHandler };
