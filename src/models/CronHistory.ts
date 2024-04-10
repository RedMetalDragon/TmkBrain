import { DataTypes } from "sequelize";
import { dbConnectCustomer } from "../database/connection";

interface CronHistoryAttributes {
    TrailID: number;
    Date: string;
}

const CronHistory = dbConnectCustomer.define('CronHistory', {
    TrailID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'CronHistory',
    timestamps: false // Disable auto-generating createdAt and updatedAt columns
});

export { CronHistory, CronHistoryAttributes };