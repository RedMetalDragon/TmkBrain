import createHttpError from "http-errors";
import { UsersService } from "./users.service";
import { PlanService } from "./plans.service";

const ValidationService = {
  async validateEmailAddress(emailAddress: string): Promise<void> {
    const emailAddressExist = await UsersService.doesEmailAddressExist(
      emailAddress
    );
    if (emailAddressExist) {
      throw new createHttpError.InternalServerError(
        `Email address already exists.`
      );
    }
  },

  async validateStripeId(stripeId: string): Promise<void> {
    const customerStripeIdExist = await UsersService.doesCustomerStripeIdExist(
      stripeId
    );
    if (customerStripeIdExist) {
      throw new createHttpError.InternalServerError(
        `Stripe ID already exists.`
      );
    }
  },

  async validatePlan(planId: number): Promise<void> {
    const plans = await PlanService.getPlan({ planId });
    if (plans.length === 0) {
      throw new createHttpError.InternalServerError(`Plan ID does not exist.`);
    }
  },
};

export { ValidationService };
