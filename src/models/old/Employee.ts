import { DataTypes } from "sequelize";
import { dbConnect } from "../../database/connection";
import { Attendance } from "./Attendance";
import { Department } from "./Department";
import { Division } from "./Division";
import { JobTitle } from "./JobTitle";
import { Schedule } from "./Schedules";

interface EmployeeAttributes {
  EmployeeID?: number;
  DivisionID: number;
  FirstName?: string;
  LastName?: string;
  MiddleName?: string;
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
  Division: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  Department: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  JobTitle: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  Manager: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Employee = dbConnect.define(
  "Employee",
  {
    EmployeeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DivisionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    tableName: "Employee",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

// Define association with the Employee model
Employee.belongsTo(Division, {
  foreignKey: "DivisionID",
  targetKey: "DivisionID",
});
Employee.belongsTo(Department, {
  foreignKey: "DepartmentID",
  targetKey: "DepartmentID",
});
Employee.belongsTo(JobTitle, {
  foreignKey: "JobTitleID",
  targetKey: "JobTitleID",
});
Employee.belongsTo(Employee, {
  as: "Manager",
  foreignKey: "ManagerID",
  targetKey: "EmployeeID",
});

Employee.belongsToMany(Schedule, { through: "EmployeeSchedule" });
Schedule.belongsToMany(Employee, { through: "EmployeeSchedule" });

Employee.hasMany(Attendance, { foreignKey: "EmployeeID", as: "attendace" });
Attendance.belongsTo(Employee, {
  foreignKey: "EmployeeID",
  targetKey: "EmployeeID",
  as: "employee",
});

export { Employee, EmployeeAttributes };
