const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Orphanage = sequelize.define("Orphanage", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users', 
            key: 'id'
        },
        onDelete: 'SET NULL'
    }
});

module.exports = Orphanage;
