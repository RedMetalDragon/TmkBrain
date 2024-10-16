import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Payment } from "./Payment";

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
  },
  {
    tableName: "Employee",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

Employee.hasMany(Payment, { foreignKey: "EmployeeID", as: "payments" });
Payment.belongsTo(Employee, { foreignKey: "EmployeeID", as: "paid_by" });

export { Employee, EmployeeAttributes };
