const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const SubscriptionPlan = require("./SubscriptionPlan");

const Subscription = sequelize.define("Subscription", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubscriptionPlan,
            key: "id"
        }
    },
    status: {
        type: DataTypes.ENUM("active", "canceled", "expired"),
        defaultValue: "active"
    },
    next_billing_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Subscription.belongsTo(SubscriptionPlan, {
    foreignKey: "plan_id",
    as: "SubscriptionPlan"
});

module.exports = Subscription;
