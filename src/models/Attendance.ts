import { DataTypes } from "sequelize";
import { dbConnectCustomer } from "../database/connection";
import { Employee } from "./Employee";

interface AttendanceAttributes {
  AttendanceID: number;
  Date: string;
  TimeIn: string;
  TimeOut: string;
  HoursRendered: number;
  EmployeeID: number;
  Tardiness: number;
  OverTime: number;
  UnderTime: number;
  IsAbsent: boolean;
  IsIncompleteLog: boolean;
}

const Attendance = dbConnectCustomer.define(
  "Attendance",
  {
    AttendanceID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TimeIn: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    TimeOut: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    HoursRendered: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Tardiness: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OverTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UnderTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsAbsent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    IsIncompleteLog: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    EmployeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "EmployeeID",
      },
    },
  },
  {
    tableName: "Attendance",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { Attendance, AttendanceAttributes };
