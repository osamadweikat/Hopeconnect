const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SubscriptionPlan = sequelize.define("SubscriptionPlan", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    renewal_period: {
        type: DataTypes.ENUM("monthly", "quarterly", "yearly"),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = SubscriptionPlan;
