const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Donation = require("./Donation");

const DonationTracking = sequelize.define("DonationTracking", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    donation_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Donation, key: "id" } 
    },
    status: { 
        type: DataTypes.ENUM("pending", "in_transit", "delivered", "used"), 
        defaultValue: "pending" 
    },
    details: { type: DataTypes.TEXT, allowNull: false },
}, { timestamps: true });

module.exports = DonationTracking;
