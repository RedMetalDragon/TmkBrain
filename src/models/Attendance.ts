import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Employee } from "./Employee";

interface AttendanceAttributes {
  AttendanceID: number;
  TimeIn: string;
  TimeOut?: string;
  HoursRendered?: number;
  EmployeeID: number;
  Tardiness?: number;
  OverTime?: number;
  UnderTime?: number;
  IsAbsent?: boolean;
  IsIncompleteLog?: boolean;
}

const Attendance = dbConnect.define(
  "Attendance",
  {
    AttendanceID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TimeIn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TimeOut: {
      type: DataTypes.STRING,
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
      allowNull: true,
    },
    IsIncompleteLog: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
