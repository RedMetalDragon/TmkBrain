import { DataTypes } from "sequelize";
import { dbConnectCore } from "../database/connection";

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
}

const Auth = dbConnectCore.define('Auth', {
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
});

export { Auth, AuthAttributes };
