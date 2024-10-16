import { DataTypes } from "sequelize";
import { dbConnect } from "../../database/connection";

interface CronHistoryAttributes {
  TrailID: number;
  DateRun: string;
}

const CronHistory = dbConnect.define(
  "CronHistory",
  {
    TrailID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DateRun: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "CronHistory",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { CronHistory, CronHistoryAttributes };
