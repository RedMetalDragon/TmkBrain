import { DataTypes } from "sequelize";
import { dbConnectCore } from "../database/connection";
import { Feature } from "./Feature";
import { Role } from "./Role";

interface RoleFeatureAttributes {
  RoleFeatureID?: number;
  RoleID: number;
  FeatureID: number;
  IsEnabled: boolean;
}

const RoleFeature = dbConnectCore.define('RoleFeature', {
    RoleFeatureID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'RoleID', 
      },
    },
    FeatureID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Feature,
        key: 'FeatureID', 
      },
    },
    IsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
});

// Define association with the Role model
RoleFeature.belongsTo(Role, { foreignKey: 'RoleID', targetKey: 'RoleID' });
RoleFeature.belongsTo(Feature, { foreignKey: 'FeatureID', targetKey: 'FeatureID' });

export { RoleFeature, RoleFeatureAttributes };