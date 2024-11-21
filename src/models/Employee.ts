import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Payment } from "./Payment";
import { Division } from "./Division";
import { Department } from "./Department";
import { JobTitle } from "./JobTitle";
import { Role } from "./Role";

interface EmployeeAttributes {
  EmployeeID?: number;
  DivisionID?: number;
  FirstName: string;
  LastName: string;
  MiddleName: string;
  DateOfBirth?: Date;
  Email: string;
  Address1?: string;
  Address2?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  Country?: string;
  JoiningDate?: Date;
  DepartmentID?: number;
  JobTitleID?: number;
  ManagerID?: number;
  Status?: string;
  StripeID: string;
  IsRootAccount: boolean;
  Division: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  Department: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  JobTitle: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  Manager: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  RoleID?: number;
}

const Employee = dbConnect.define(
  "Customer",
  {
    EmployeeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DivisionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    FirstName: {
      type: DataTypes.STRING(50),
    },
    MiddleName: {
      type: DataTypes.STRING(50),
    },
    LastName: {
      type: DataTypes.STRING(50),
    },
    DateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Address1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Address2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    City: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    State: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ZipCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    JoiningDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    JobTitleID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ManagerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    StripeID: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    IsRootAccount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "RoleID",
      },
    },
  },
  {
    tableName: "Employee",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

Employee.hasMany(Payment, { foreignKey: "EmployeeID", as: "payments" });
Payment.belongsTo(Employee, { foreignKey: "EmployeeID", as: "paid_by" });

Employee.belongsTo(Division, { foreignKey: "DivisionID", as: "division" });
Division.hasMany(Employee, { foreignKey: "DivisionID", as: "employees" });

Employee.belongsTo(Department, {
  foreignKey: "DepartmentID",
  as: "department",
});
Department.hasMany(Employee, { foreignKey: "DepartmentID", as: "employees" });

Employee.hasOne(JobTitle, { foreignKey: "JobTitleID", as: "jobTitle" });
JobTitle.hasMany(Employee, { foreignKey: "JobTitleID", as: "employees" });

Employee.hasOne(Employee, { foreignKey: "ManagerID", as: "manager" });
Employee.hasMany(Employee, { foreignKey: "ManagerID", as: "subordinates" });

export { Employee, EmployeeAttributes };
