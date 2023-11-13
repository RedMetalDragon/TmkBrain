import { DataTypes } from "sequelize";
import connectDb from "../database/connection";

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
  CustomerDbName: string;
}

const Customer = connectDb.define('Customer', {
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
  CustomerDbName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

export { Customer, CustomerAttributes };
