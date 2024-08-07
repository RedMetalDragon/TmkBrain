import { Model, Transaction } from "sequelize";
import { Employee, EmployeeAttributes } from "../models/Employee";
import { dbConnect } from "../database/connection";
import { PaymentService } from "./payment.service";
import { PlanService } from "./plans.service";
import { AuthService } from "./auth.service";
import { CreateCustomerBody } from "../handlers";

/* eslint-disable @typescript-eslint/no-explicit-any */
const UsersService = {
  async createCustomerTransaction(
    customerData: CreateCustomerBody,
    salt: string,
    hashedPassword: string
  ): Promise<boolean | Error> {
    const transaction = await dbConnect.transaction();

    try {
      const createCustomer = {
        CustomerName: customerData.name,
        ContactNumber: customerData.contact_number,
        Email: customerData.email_address,
        Address1: customerData.address,
        CustomerStripeID: customerData.customer_stripe_id,
      };

      const customer = await this.saveCustomer(createCustomer, transaction);
      const customerId = (customer as unknown as EmployeeAttributes).EmployeeID;

      const createPayment = {
        CustomerID: customerId,
        PaymentAmount: customerData.paid_amount,
      };

      const createCustomerPlan = {
        CustomerID: customerId,
        PlanID: customerData.plan_id,
      };

      const createAuth = {
        CustomerID: customerId,
        Email: customerData.email_address,
        Salt: salt,
        PasswordHash: hashedPassword,
      };

      await PaymentService.savePayment(createPayment, transaction);
      await PlanService.saveCustomerPlan(createCustomerPlan, transaction);
      await AuthService.saveAuth(createAuth, transaction);
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      return error as Error;
    }
  },

  async saveCustomer(
    customer: Record<string, unknown>,
    transaction: Transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await Employee.create(customer, { transaction });
    } catch (error) {
      return error as Error;
    }
  },

  async doesEmailAddressExist(emailAddress: string): Promise<boolean> {
    const user = await Employee.findOne({
      where: {
        Email: emailAddress,
      },
    });

    return user !== null;
  },

  async doesCustomerStripeIdExist(customerStripeId: string): Promise<boolean> {
    const user = await Employee.findOne({
      where: {
        CustomerStripeID: customerStripeId,
      },
    });

    return user !== null;
  },
};

export { UsersService };
