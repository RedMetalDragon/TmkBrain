import { Model, Transaction, WhereOptions } from "sequelize";
import { Plan, PlanAttributes } from "../models/Plan";
import { CompanyPlan } from "../models/CustomerPlan";
import { Feature, FeatureAttributes } from "../models/Feature";

/* eslint-disable @typescript-eslint/no-explicit-any */
const PlanService = {
  async getPlan({
    planId,
  }: {
    planId?: number;
  }): Promise<Record<any, any> | null> {
    let where: WhereOptions = {};
    if (planId !== undefined) {
      where = {
        PlanId: planId,
      };
    }

    const plans = await Plan.findAll({
      where: {
        ...where,
        IsActive: true,
      },
      include: [
        {
          model: Feature,
          as: "features",
          where: {
            IsActive: true,
          },
        },
      ],
    });

    return plans.map((plan) => {
      const _plan = plan as unknown as PlanAttributes;
      return {
        plan_id: _plan.PlanID,
        plan_name: _plan.PlanName,
        description: _plan.Description,
        price: _plan.Price,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        features: (plan as any).features.map((feature) => {
          return {
            feature_id: (feature as unknown as FeatureAttributes).FeatureID,
            feature_name: (feature as unknown as FeatureAttributes).FeatureName,
            description: (feature as unknown as FeatureAttributes).Description,
          };
        }),
      };
    });
  },

  async saveCustomerPlan(
    customerPlan: Record<string, unknown>,
    transaction: Transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await CompanyPlan.create(customerPlan, { transaction });
    } catch (error) {
      return error as Error;
    }
  },
};

export { PlanService };
