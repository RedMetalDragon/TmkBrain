import { DataTypes } from "sequelize";
import { dbConnectCustomer } from "../database/connection";
import { Employee } from "./Employee";
import { Schedule } from "./Schedules";

interface EmployeeScheduleAttributes {
  EmployeeScheduleID?: number;
  EmployeeID?: number;
  ScheduleID?: number;
  Workdays: string;
  Employee: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  Schedule: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const EmployeeSchedule = dbConnectCustomer.define(
  "EmployeeSchedule",
  {
    EmployeeScheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EmployeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "EmployeeID",
      },
    },
    ScheduleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Schedule,
        key: "ScheduleID",
      },
    },
    Workdays: {
      type: DataTypes.STRING(5000),
    },
  },
  {
    tableName: "EmployeeSchedule",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

EmployeeSchedule.belongsTo(Employee, { foreignKey: "EmployeeID" });
EmployeeSchedule.belongsTo(Schedule, { foreignKey: "ScheduleID" });

export { EmployeeSchedule, EmployeeScheduleAttributes };
