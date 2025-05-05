const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Notification = sequelize.define("Notification", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    status: {
        type: DataTypes.ENUM("unread", "read"),
        defaultValue: "unread"
    }
}, {
    tableName: "Notifications",
    timestamps: true
});

module.exports = Notification;
