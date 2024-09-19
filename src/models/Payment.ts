import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Employee } from "./Employee";

interface PaymentAttributes {
  PaymentID?: number;
  EmployeeID: number;
  PaymentDate: string;
  PaymentAmount: number;
}

const Payment = dbConnect.define(
  "Payment",
  {
    PaymentID: {
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
    PaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    PaymentAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Payment",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { PaymentAttributes, Payment };
