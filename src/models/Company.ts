import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";

interface CompanyAttributes {
  CompanyID?: number;
  CompanyName: string;
  CompanyAddress?: string;
  CompanyIndustry?: string;
  S3BucketName?: string;
}

const Company = dbConnect.define(
  "Company",
  {
    CompanyID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CompanyName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    CompanyAddress: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CompanyIndustry: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    S3BucketName: {
      type: DataTypes.STRING(500),
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "Company",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { CompanyAttributes, Company };
