import { Model } from "sequelize";
import { RoleFeature } from "../models/old/RoleFeature";
import { Auth } from "../models/old/Auth";
import { Feature, FeatureAttributes } from "../models/old/Feature";
import { Customer } from "../models/old/Customer";
import { Employee, EmployeeAttributes } from "../models/old/Employee";
import { Division } from "../models/old/Division";
import { Department } from "../models/old/Department";
import { JobTitle } from "../models/old/JobTitle";
import { EmployeeLog } from "../models/old/EmployeeLog";
import { getCurrentDateTime } from "../handlers/helpers";

/* eslint-disable @typescript-eslint/no-explicit-any */
const UsersController = {
  async getEmployees(): Promise<Record<any, any>[] | null> {
    return await Employee.findAll({
      include: [
        {
          model: Division,
          attributes: ["DivisionName"],
        },
        {
          model: Department,
          attributes: ["DepartmentName"],
        },
        {
          model: JobTitle,
          attributes: ["JobTitleName"],
        },
        {
          model: Employee,
          as: "Manager",
          attributes: ["FirstName", "LastName", "MiddleName"],
        },
      ],
    }).then((employees) => {
      if (employees === null) {
        return null;
      }

      const resultArray: Record<string, unknown>[] = [];
      employees.forEach((employee) => {
        const mappedEmployee = {
          employee_id: (employee as unknown as EmployeeAttributes).EmployeeID,
          first_name: (employee as unknown as EmployeeAttributes).FirstName,
          middle_name: (employee as unknown as EmployeeAttributes).MiddleName,
          last_name: (employee as unknown as EmployeeAttributes).LastName,
          birthday: (employee as unknown as EmployeeAttributes).DateOfBirth,
          gender: (employee as unknown as EmployeeAttributes).Gender,
          contact_number: (employee as unknown as EmployeeAttributes)
            .ContactNumber,
          email_address: (employee as unknown as EmployeeAttributes).Email,
          company_email_address: (employee as unknown as EmployeeAttributes)
            .CompanyEmail,
          address_1: (employee as unknown as EmployeeAttributes).Address1,
          address_2: (employee as unknown as EmployeeAttributes).Address2,
          city: (employee as unknown as EmployeeAttributes).City,
          state: (employee as unknown as EmployeeAttributes).State,
          zip_code: (employee as unknown as EmployeeAttributes).ZipCode,
          country: (employee as unknown as EmployeeAttributes).Country,
          joining_date: (employee as unknown as EmployeeAttributes).JoiningDate,
          status: (employee as unknown as EmployeeAttributes).Status,
          division: (employee as unknown as EmployeeAttributes).Division.get(
            "DivisionName"
          ),
          department: (
            employee as unknown as EmployeeAttributes
          ).Department.get("DepartmentName"),
          job_title: (employee as unknown as EmployeeAttributes).JobTitle.get(
            "JobTitleName"
          ),
          manager: (employee as unknown as EmployeeAttributes).Manager
            ? {
                first_name: (
                  employee as unknown as EmployeeAttributes
                ).Manager.get("FirstName"),
                middle_name: (
                  employee as unknown as EmployeeAttributes
                ).Manager.get("MiddleName"),
                last_name: (
                  employee as unknown as EmployeeAttributes
                ).Manager.get("LastName"),
              }
            : {},
        };

        resultArray.push(mappedEmployee);
      });

      return resultArray;
    });
  },

  async getEmployeeData(employeeID: number): Promise<Record<any, any> | null> {
    return await Employee.findOne({
      where: {
        EmployeeID: employeeID,
      },
      include: [
        {
          model: Division,
          attributes: ["DivisionName"],
        },
        {
          model: Department,
          attributes: ["DepartmentName"],
        },
        {
          model: JobTitle,
          attributes: ["JobTitleName"],
        },
        {
          model: Employee,
          as: "Manager",
          attributes: ["FirstName", "LastName", "MiddleName"],
        },
      ],
    }).then((employee) => {
      if (employee === null) {
        return null;
      }

      const mappedEmployee = {
        employee_id: (employee as unknown as EmployeeAttributes).EmployeeID,
        first_name: (employee as unknown as EmployeeAttributes).FirstName,
        middle_name: (employee as unknown as EmployeeAttributes).MiddleName,
        last_name: (employee as unknown as EmployeeAttributes).LastName,
        birthday: (employee as unknown as EmployeeAttributes).DateOfBirth,
        gender: (employee as unknown as EmployeeAttributes).Gender,
        contact_number: (employee as unknown as EmployeeAttributes)
          .ContactNumber,
        email_address: (employee as unknown as EmployeeAttributes).Email,
        company_email_address: (employee as unknown as EmployeeAttributes)
          .CompanyEmail,
        address_1: (employee as unknown as EmployeeAttributes).Address1,
        address_2: (employee as unknown as EmployeeAttributes).Address2,
        city: (employee as unknown as EmployeeAttributes).City,
        state: (employee as unknown as EmployeeAttributes).State,
        zip_code: (employee as unknown as EmployeeAttributes).ZipCode,
        country: (employee as unknown as EmployeeAttributes).Country,
        joining_date: (employee as unknown as EmployeeAttributes).JoiningDate,
        status: (employee as unknown as EmployeeAttributes).Status,
        division: (employee as unknown as EmployeeAttributes).Division.get(
          "DivisionName"
        ),
        department: (employee as unknown as EmployeeAttributes).Department.get(
          "DepartmentName"
        ),
        job_title: (employee as unknown as EmployeeAttributes).JobTitle.get(
          "JobTitleName"
        ),
        manager: (employee as unknown as EmployeeAttributes).Manager
          ? {
              first_name: (
                employee as unknown as EmployeeAttributes
              ).Manager.get("FirstName"),
              middle_name: (
                employee as unknown as EmployeeAttributes
              ).Manager.get("MiddleName"),
              last_name: (
                employee as unknown as EmployeeAttributes
              ).Manager.get("LastName"),
            }
          : {},
      };

      return mappedEmployee;
    });
  },

  getDashboardData(): Record<any, any> | null {
    return {
      employee_fname: "John",
      employee_mname: "Dela",
      employee_lname: "Cruz",
      company_name: "Company",
      company_logo: "logo:url",
      today_worked_hours: "03:00",
      today_scheduled_hours: "08:00",
      today_remaining_hours: "05:00",
      monthly_scheduled_hours: "216 hrs",
      monthly_worked_hours: "189 hrs",
      monthly_remaining_hours: "23 hrs",
      monthly_overtime_hours: "56 hrs",
    };
  },

  getAttendance(): Record<any, any>[] | null {
    return [
      {
        date: "2023-10-01",
        in: "08:00:00am",
        out: "05:00:00pm",
        day: "Sunday",
        hours: "8 hours",
      },
      {
        date: "2023-10-02",
        in: "08:00:00am",
        out: "05:00:00pm",
        day: "Monday",
        hours: "8 hours",
      },
      {
        date: "2023-10-03",
        in: "08:00:00am",
        out: "05:00:00pm",
        day: "Tuesday",
        hours: "8 hours",
      },
    ];
  },

  async saveAttendance(employee_id: number): Promise<Model<any, any> | Error> {
    console.log(getCurrentDateTime());

    try {
      return await EmployeeLog.create({
        EmployeeID: employee_id,
        LogTime: getCurrentDateTime(),
      });
    } catch (error) {
      return error as Error;
    }
  },

  async getLogs(employee_id: number): Promise<Model<any, any>[] | null> {
    return await EmployeeLog.findAll({
      where: {
        EmployeeID: employee_id,
      },
      attributes: [
        ["EmployeeLogID", "employee_log_id"],
        ["LogTime", "log"],
      ],
    });
  },

  async getRole(roleId: number): Promise<Record<any, any>[] | null> {
    return await RoleFeature.findAll({
      where: {
        RoleID: roleId,
        IsEnabled: true,
      },
      attributes: [],
      include: [
        {
          model: Feature,
          attributes: [
            "FeatureID",
            "FeatureName",
            "Route",
            "IconURL",
            "ParentTab",
          ],
          where: {
            IsActive: true,
          },
        },
      ],
    }).then((roleFeatures) => {
      const resultArray: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
      const parentMap = {};

      roleFeatures.forEach((roleFeature) => {
        const parent = (
          roleFeature as unknown as FeatureAttributes
        ).Feature.get("ParentTab");
        const name = (roleFeature as unknown as FeatureAttributes).Feature.get(
          "FeatureName"
        );
        const route = (roleFeature as unknown as FeatureAttributes).Feature.get(
          "Route"
        );
        const icon = (roleFeature as unknown as FeatureAttributes).Feature.get(
          "IconURL"
        );

        // If parent is not null, add the item to the parent's sublists
        if (parent !== null) {
          if (!parentMap[parent]) {
            // If the parent doesn't exist in the map, create it
            parentMap[parent] = {
              name: parent,
              icon: icon,
              sublists: [],
            };
            resultArray.push(parentMap[parent]);
          }

          // Add the item to the parent's sublists
          parentMap[parent].sublists.push({
            name: name,
            route: route,
          });
        } else {
          // If parent is null, directly add the item to the result array
          resultArray.push({
            name: name,
            route: route,
            icon: icon,
          });
        }
      });

      return resultArray;
    });
  },

  async getCustomerDetails(
    customerID: number
  ): Promise<Record<any, any> | null> {
    return await Customer.findOne({
      where: {
        CustomerID: customerID,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
  },

  async authenticate(username: string): Promise<Model<any, any> | null> {
    return await Auth.findOne({
      where: {
        EmailAddress: username,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
  },
};

export { UsersController };
