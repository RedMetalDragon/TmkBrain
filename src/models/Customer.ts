import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Payment } from "./Payment";

interface CustomerAttributes {
  CustomerID?: number;
  CustomerName: string;
  ContactNumber: string;
  Email: string;
  Address1?: string;
  Address2?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  Country?: string;
  CustomerLogo: string;
  CustomerStripeID: string;
}

const Customer = dbConnect.define(
  "Customer",
  {
    CustomerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CustomerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ContactNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    CustomerLogo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    CustomerStripeID: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Customer",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

Customer.hasMany(Payment, { foreignKey: "CustomerID", as: "payments" });
Payment.belongsTo(Customer, { foreignKey: "CustomerID", as: "paid_by" });

export { Customer, CustomerAttributes };
