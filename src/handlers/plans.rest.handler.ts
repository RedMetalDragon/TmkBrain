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

      res.status(200).json(
        plans.map((plan) => {
          return {
            plan_id: (plan as unknown as PlanAttributes).PlanID,
            plan_name: (plan as unknown as PlanAttributes).PlanName,
            description: (plan as unknown as PlanAttributes).Description,
            price: (plan as unknown as PlanAttributes).Price, 
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            features: (plan as any).features.map((feature) => {
              return {
                feature_id: (feature as unknown as FeatureAttributes).FeatureID,
                feature_name: (feature as unknown as FeatureAttributes)
                  .FeatureName,
                description: (feature as unknown as FeatureAttributes)
                  .Description,
              };
            }),
          };
        })
      );
    } catch (error) {
      next(error);
    }
  },
};

export { PlansRestHandler };
