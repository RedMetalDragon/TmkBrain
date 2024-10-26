import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Division } from "./Division";

interface DepartmentAttributes {
  DepartmentID?: number;
  DepartmentName: string;
  Description?: string;
  DivisionID: number;
}

const Department = dbConnect.define(
  "Department",
  {
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
      allowNull: true,
    },
    DivisionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Division,
        key: "DivisionID",
      },
    },
  },
  {
    tableName: "Department",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { Department, DepartmentAttributes };
