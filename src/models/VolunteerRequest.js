const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Orphanage = require("./Orphanage");

const VolunteerRequest = sequelize.define("VolunteerRequest", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orphanage_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: Orphanage, key: "id" }
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("open", "matched", "closed"), defaultValue: "open" }
}, { timestamps: true });

module.exports = VolunteerRequest;
