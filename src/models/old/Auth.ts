import { DataTypes } from "sequelize";
import { dbConnect } from "../../database/connection";
import { Role } from "./Role";

interface AuthAttributes {
  AuthID?: number;
  UserID: number;
  CustomerID: number;
  EmailAddress: string;
  Salt: string;
  PasswordHash?: string;
  PasswordResetToken?: string;
  PasswordResetTokenExpiration?: Date;
  KeepLoggedIn?: boolean;
  Status: string;
  RoleID: number;
}

const Auth = dbConnect.define("Auth", {
  AuthID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  EmailAddress: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Salt: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
  },
  PasswordResetToken: {
    type: DataTypes.STRING(255),
  },
  PasswordResetTokenExpiration: {
    type: DataTypes.DATE,
  },
  KeepLoggedIn: {
    type: DataTypes.BOOLEAN,
  },
  Status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  RoleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "RoleID",
    },
  },
});

// Define association with the Role model
Auth.belongsTo(Role, { foreignKey: "RoleID", targetKey: "RoleID" });

export { Auth, AuthAttributes };
