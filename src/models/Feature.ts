import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Plan } from "./Plan";

interface FeatureAttributes {
  FeatureID?: number;
  FeatureName: string;
  FeatureDescription: string;
  PlanID: number;
  IsActive: boolean;
}

const Feature = dbConnect.define(
  "Feature",
  {
    FeatureID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FeatureName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    FeatureDescription: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    PlanID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Plan,
        key: "PlanID",
      },
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "Feature",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

Feature.belongsTo(Plan, { foreignKey: "PlanID", as: "plan" });

export { FeatureAttributes, Feature };
