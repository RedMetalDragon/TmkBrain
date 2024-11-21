import createHttpError from "http-errors";
import { UsersService } from "./users.service";
import { PlanService } from "./plans.service";
import { isNumeric } from "../handlers/helpers";
import { ObjectSchema } from "joi/lib";

const ValidationService = {
  validateSchema(schema: ObjectSchema, body: Record<string, unknown>): void {
    const { error } = schema.validate(body);

    if (error) {
      throw new createHttpError.InternalServerError(
        `Please check request schema. Refer to the OpenAPI documentation for the correct endpoint usage. - ${error}`
      );
    }
  },

  validateEmployeeID(employee_id: string): void {
    if (!isNumeric(employee_id)) {
      throw new createHttpError.InternalServerError(
        `Please provide numeric employee ID.`
      );
    }
  },

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
    if (plans === null) {
      throw new createHttpError.InternalServerError(`Plan ID does not exist.`);
    }
  },
};

export { ValidationService };
