import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Customer } from "./Customer";

interface PaymentAttributes {
  PaymentID?: number;
  CustomerID: number;
  PaymentDate: string;
  PaymentAmount: number;
}

const Payment = dbConnect.define("Payment", {
  PaymentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: "CustomerID",
    },
  },
  PaymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  PaymentAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Payment.belongsTo(Customer, { foreignKey: "CustomerID", as: "paid_by" });

export { PaymentAttributes, Payment };
