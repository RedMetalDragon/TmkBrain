import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Department } from "./Department";

interface JobTitleAttributes {
  JobTitleID?: number;
  JobTitleName: string;
  Description?: string;
  DepartmentID: number;
  IsActive?: boolean;
}

const JobTitle = dbConnect.define(
  "JobTitle",
  {
    JobTitleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    JobTitleName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Department,
        key: "DepartmentID",
      },
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "JobTitle",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { JobTitle, JobTitleAttributes };
