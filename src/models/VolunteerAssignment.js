const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const VolunteerAssignment = sequelize.define("VolunteerAssignment", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    volunteer_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: User, key: "id" }
    },
    volunteer_request_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "confirmed", "rejected"), defaultValue: "pending" },
    rating: { type: DataTypes.INTEGER, allowNull: true },
    review: { type: DataTypes.TEXT, allowNull: true }
}, { timestamps: true });

module.exports = VolunteerAssignment;
