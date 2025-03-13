import { Model, Transaction } from "sequelize";
import { Employee, EmployeeAttributes } from "../models/Employee";
import { dbConnect } from "../database/connection";
import { PaymentService } from "./payment.service";
import { PlanService } from "./plans.service";
import { AuthService } from "./auth.service";
import { CreateCustomerBody, EnrollEmployeeBody } from "../handlers";
import { Department } from "../models/Department";
import { Division } from "../models/Division";
import { JobTitle } from "../models/JobTitle";
import { CompanyService } from "./company.service";
import { CompanyAttributes } from "../models/Company";

/* eslint-disable @typescript-eslint/no-explicit-any */
const UsersService = {
  async createCustomerTransaction(
    customerData: CreateCustomerBody,
    salt: string,
    hashedPassword: string,
    bucketName: string
  ): Promise<boolean | Error> {
    const transaction = await dbConnect.transaction();

    try {
      const createCompany = {
        CompanyName: customerData.company_name,
        S3BucketName: bucketName,
      };

      const company = await CompanyService.saveCompany(
        createCompany,
        transaction
      );

      const createCustomer = {
        FirstName: customerData.first_name,
        LastName: customerData.last_name,
        MiddleName: customerData.middle_name,
        Email: customerData.email_address,
        Address1: customerData.address,
        StripeID: customerData.stripe_id,
        IsRootAccount: true,
        RoleID: 1, // default to Root Role
        CompanyID: (company as unknown as CompanyAttributes).CompanyID,
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
        RoleID: 3, // default to Employee Role
        CompanyID: employeeData.company_id,
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

  async getEmployeeData(employeeID: number): Promise<Record<any, any> | null> {
    return await Employee.findOne({
      where: {
        EmployeeID: employeeID,
      },
      include: [
        {
          model: Division,
          as: "division",
          attributes: ["DivisionName"],
        },
        {
          model: Department,
          as: "department",
          attributes: ["DepartmentName"],
        },
        {
          model: JobTitle,
          as: "jobTitle",
          attributes: ["JobTitleName"],
        },
        {
          model: Employee,
          as: "manager",
          attributes: ["FirstName", "LastName", "MiddleName"],
        },
      ],
    }).then((employee) => {
      if (employee === null) {
        return null;
      }

      const _employee = employee as unknown as EmployeeAttributes;
      const mappedEmployee = {
        employee_id: _employee.EmployeeID,
        first_name: _employee.FirstName,
        middle_name: _employee.MiddleName,
        last_name: _employee.LastName,
        birthday: _employee.DateOfBirth,
        email_address: _employee.Email,
        address_1: _employee.Address1 ?? "",
        address_2: _employee.Address2 ?? "",
        city: _employee.City ?? "",
        state: _employee.State ?? "",
        zip_code: _employee.ZipCode ?? "",
        country: _employee.Country ?? "",
        joining_date: _employee.JoiningDate ?? "",
        status: _employee.Status ?? "",
        role_id: _employee.RoleID ?? "",
        division: _employee.Division?.get("DivisionName") ?? "Not assigned yet",
        department:
          _employee.Department?.get("DepartmentName") ?? "Not assigned yet",
        job_title:
          _employee.JobTitle?.get("JobTitleName") ?? "Not assigned yet",
        manager: _employee.Manager
          ? {
              first_name: _employee.Manager.get("FirstName"),
              middle_name: _employee.Manager.get("MiddleName"),
              last_name: _employee.Manager.get("LastName"),
            }
          : {},
      };

      return mappedEmployee;
    });
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
