import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";

interface DivisionAttributes {
  DivisionID?: number;
  DivisionName: string;
}

const Division = dbConnect.define(
  "Division",
  {
    DivisionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DivisionName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "Division",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { Division, DivisionAttributes };
