import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";

interface PlanAttributes {
  PlanID?: number;
  PlanName: string;
  Description: string;
  IsActive: boolean;
  Price: number;
  CreationDate: string;
}

const Plan = dbConnect.define(
  "Plan",
  {
    PlanID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PlanName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CreationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Plan",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { PlanAttributes, Plan };
