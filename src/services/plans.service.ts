import { Model, WhereOptions } from "sequelize";
import { Plan } from "../models/Plan";
import { CustomerPlan } from "../models/CustomerPlan";

const PlanService = {
  async getPlan({ planId }: { planId?: number }): Promise<Model<any, any>[]> {
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
    });

    return plans;
  },

  async saveCustomerPlan(
    customerPlan: Record<string, unknown>,
    transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await CustomerPlan.create(customerPlan, { transaction });
    } catch (error) {
      return error as Error;
    }
  },
};

export { PlanService };
