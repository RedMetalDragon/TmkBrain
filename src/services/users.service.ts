import { Model, Transaction } from "sequelize";
import { Employee, EmployeeAttributes } from "../models/Employee";
import { dbConnect } from "../database/connection";
import { PaymentService } from "./payment.service";
import { PlanService } from "./plans.service";
import { AuthService } from "./auth.service";
import { CreateCustomerBody, EnrollEmployeeBody } from "../handlers";

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
        FirstName: customerData.first_name,
        LastName: customerData.last_name,
        MiddleName: customerData.middle_name,
        Email: customerData.email_address,
        Address1: customerData.address,
        CustomerStripeID: customerData.stripe_id,
        IsRootAccount: true,
      };

      const customer = await this.saveEmployee(createCustomer, transaction);
      const employeeId = (customer as unknown as EmployeeAttributes).EmployeeID;

      const createPayment = {
        EmployeeID: employeeId,
        PaymentAmount: customerData.paid_amount,
      };

      const createCustomerPlan = {
        EmployeeID: employeeId,
        PlanID: customerData.plan_id,
      };

      const createAuth = {
        EmployeeID: employeeId,
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

  async enrollEmployeeTransaction(
    employeeData: EnrollEmployeeBody,
    salt: string,
    hashedPassword: string
  ): Promise<boolean | Error> {
    const transaction = await dbConnect.transaction();

    try {
      const createEmployee = {
        FirstName: employeeData.first_name,
        LastName: employeeData.last_name,
        MiddleName: employeeData.middle_name,
        Email: employeeData.email_address,
        DateOfBirth: employeeData.birthday,
      };

      const employee = await this.saveEmployee(createEmployee, transaction);
      const employeeId = (employee as unknown as EmployeeAttributes).EmployeeID;

      const createAuth = {
        EmployeeID: employeeId,
        Email: employeeData.email_address,
        Salt: salt,
        PasswordHash: hashedPassword,
      };

      await AuthService.saveAuth(createAuth, transaction);
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      return error as Error;
    }
  },

  async saveEmployee(
    customer: Record<string, unknown>,
    transaction: Transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await Employee.create(customer, { transaction });
    } catch (error) {
      return error as Error;
    }
  },

  // TODO: refactor to getUser({attribute})
  async doesEmailAddressExist(emailAddress: string): Promise<boolean> {
    const user = await Employee.findOne({
      where: {
        Email: emailAddress,
      },
    });

    return user !== null;
  },

  // TODO: refactor to getUser({attribute})
  async doesCustomerStripeIdExist(customerStripeId: string): Promise<boolean> {
    const user = await Employee.findOne({
      where: {
        StripeID: customerStripeId,
      },
    });

    return user !== null;
  },
};

export { UsersService };
