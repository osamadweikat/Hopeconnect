const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Donation = require("./Donation");

const DonationSpending = sequelize.define("DonationSpending", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    donation_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Donation, key: "id" } 
    },
    amount_spent: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    date_spent: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: true });

module.exports = DonationSpending;
