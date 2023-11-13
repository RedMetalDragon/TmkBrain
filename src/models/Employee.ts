import { DataTypes } from "sequelize";
import connectDb from "../database/connection";

interface EmployeeAttributes {
  EmployeeID?: number;
  DivisionID: number;
  CustomerID: number;
  FirstName?: string;
  LastName?: string;
  DateOfBirth?: Date;
  Gender?: string;
  ContactNumber?: string;
  Email?: string;
  CompanyEmail?: string;
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
}

const Employee = connectDb.define('Employee', {
  EmployeeID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  DivisionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FirstName: {
    type: DataTypes.STRING(50),
  },
  LastName: {
    type: DataTypes.STRING(50),
  },
  DateOfBirth: {
    type: DataTypes.DATE,
  },
  Gender: {
    type: DataTypes.STRING(10),
  },
  ContactNumber: {
    type: DataTypes.STRING(20),
  },
  Email: {
    type: DataTypes.STRING(255),
  },
  CompanyEmail: {
    type: DataTypes.STRING(255),
  },
  Address1: {
    type: DataTypes.STRING(255),
  },
  Address2: {
    type: DataTypes.STRING(255),
  },
  City: {
    type: DataTypes.STRING(100),
  },
  State: {
    type: DataTypes.STRING(50),
  },
  ZipCode: {
    type: DataTypes.STRING(20),
  },
  Country: {
    type: DataTypes.STRING(100),
  },
  JoiningDate: {
    type: DataTypes.DATE,
  },
  DepartmentID: {
    type: DataTypes.INTEGER,
  },
  JobTitleID: {
    type: DataTypes.INTEGER,
  },
  ManagerID: {
    type: DataTypes.INTEGER,
  },
  Status: {
    type: DataTypes.STRING(50),
  },
});

export { Employee, EmployeeAttributes };
