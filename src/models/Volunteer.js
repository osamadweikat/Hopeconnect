const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Volunteer = sequelize.define("Volunteer", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    skills: { type: DataTypes.TEXT, allowNull: false },
    availability: { type: DataTypes.STRING },
    preferred_location: { type: DataTypes.STRING },  
}, { timestamps: true });

module.exports = Volunteer;
