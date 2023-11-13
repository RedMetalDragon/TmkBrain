import { DataTypes } from "sequelize";
import connectDb from "../database/connection";

interface DepartmentAttributes {
  DepartmentID?: number;
  DepartmentName: string;
  Description?: string;
  DivisionID: number;
}

const Department = connectDb.define('Department', {
  DepartmentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  DepartmentName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING(255),
  },
  DivisionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export { Department, DepartmentAttributes };
