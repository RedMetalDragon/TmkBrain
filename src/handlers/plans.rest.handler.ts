import { NextFunction, Request, Response } from "express";
import { PlanService } from "../services/plans.service";
import { PlanAttributes } from "../models/Plan";
import { FeatureAttributes } from "../models/Feature";

const PlansRestHandler = {
  async getPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const plans = await PlanService.getPlan({});

      res.status(200).json(plans);
    } catch (error) {
      next(error);
    }
  },
};

export { PlansRestHandler };
