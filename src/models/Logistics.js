const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Donation = require("./Donation");

const Logistics = sequelize.define("Logistics", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    donation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Donation, key: "id" },
    },
    status: {
        type: DataTypes.ENUM("pending", "in_transit", "delivered", "failed"),
        defaultValue: "pending",
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: "Logistics"
});

module.exports = Logistics;
