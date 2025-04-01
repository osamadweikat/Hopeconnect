const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); 

const Sponsorship = sequelize.define("Sponsorship", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sponsor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orphan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "USD"
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Sponsorship;
