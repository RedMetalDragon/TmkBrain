import { Model, Transaction, WhereOptions } from "sequelize";
import { Plan } from "../models/Plan";
import { CompanyPlan } from "../models/CustomerPlan";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
