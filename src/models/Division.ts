import { DataTypes } from "sequelize";
import { dbConnectCustomer } from "../database/connection";

interface DivisionAttributes {
  DivisionID?: number;
  DivisionName: string;
  DivisionType: string;
  CompanyID: number;
  ContactNumber?: string;
  Email?: string;
  Address1?: string;
  Address2?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  Country?: string;
}

const Division = dbConnectCustomer.define('Division', {
  DivisionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  DivisionName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  DivisionType: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  CompanyID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ContactNumber: {
    type: DataTypes.STRING(20),
  },
  Email: {
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
});

export { Division, DivisionAttributes };
