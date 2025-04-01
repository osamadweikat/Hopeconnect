const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); 

const DonationUpdate = sequelize.define("DonationUpdate", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    donation_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    update_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

module.exports = DonationUpdate;
