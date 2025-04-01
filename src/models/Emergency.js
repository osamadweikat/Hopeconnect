const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Emergency = sequelize.define("Emergency", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    target_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    collected_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "USD"
    },
    status: {
        type: DataTypes.ENUM("active", "completed"),
        defaultValue: "active"
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    }
});

module.exports = Emergency;
