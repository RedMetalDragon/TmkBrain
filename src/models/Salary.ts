import { DataTypes } from "sequelize";
import { dbConnectCustomer } from "../database/connection";

interface SalaryAttributes {
  SalaryID?: number;
  EmployeeID: number;
  EffectiveDate?: Date;
  Amount?: number;
}

const Salary = dbConnectCustomer.define('Salary', {
  SalaryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EmployeeID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  EffectiveDate: {
    type: DataTypes.DATE,
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
});

export { Salary, SalaryAttributes };
