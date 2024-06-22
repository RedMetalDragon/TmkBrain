import { Model, Transaction } from "sequelize";
import { Payment } from "../models/Payment";

/* eslint-disable @typescript-eslint/no-explicit-any */
const PaymentService = {
  async savePayment(
    payment: Record<string, unknown>,
    transaction: Transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await Payment.create(payment, { transaction });
    } catch (error) {
      return error as Error;
    }
  },
};

export { PaymentService };
