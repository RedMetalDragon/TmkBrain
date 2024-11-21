import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Role } from "./Role";
import { Feature } from "./Feature";

interface PermissionAttributes {
  PermissionID?: number;
  RoleID: number;
  FeatureID: number;
}

const Permission = dbConnect.define(
  "Permission",
  {
    PermissionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "RoleID",
      },
    },
    FeatureID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Feature,
        key: "FeatureID",
      },
    },
  },
  {
    tableName: "Permission",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

Permission.hasMany(Feature, { foreignKey: "FeatureID", as: "features" });

Feature.belongsTo(Permission, { foreignKey: "FeatureID", as: "permission_id" });

export { PermissionAttributes, Permission };
