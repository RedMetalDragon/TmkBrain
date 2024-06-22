import { Model } from "sequelize";
import { Payment } from "../models/Payment";

const PaymentService = {
  async savePayment(
    payment: Record<string, unknown>,
    transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await Payment.create(payment, { transaction });
    } catch (error) {
      return error as Error;
    }
  },
};

export { PaymentService };
