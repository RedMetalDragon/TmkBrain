import { DataTypes } from "sequelize";
import { dbConnect } from "../../database/connection";
import { Employee } from "./Employee";

interface EmployeeLogAttributes {
  EmployeeLogID: number;
  EmployeeID: number;
  LogTime: string;
  Location?: string;
}

const EmployeeLog = dbConnect.define(
  "EmployeeLog",
  {
    EmployeeLogID: {
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
    LogTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "EmployeeLog",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

EmployeeLog.belongsTo(Employee, { foreignKey: "EmployeeID" });

export { EmployeeLog, EmployeeLogAttributes };
