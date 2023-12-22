import { DataTypes } from "sequelize";
import { dbConnectCore } from "../database/connection";

interface FeatureAttributes {
  FeatureID: number;
  FeatureName: string;
  Description: string;
  IsActive: boolean;
  Price: number;
  CreationDate: Date;
  Feature: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any 
}

const Feature = dbConnectCore.define('Feature', {
    FeatureID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FeatureName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    CreationDate: {
      type: DataTypes.DATE,
    },
});

export { Feature, FeatureAttributes };