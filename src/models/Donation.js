const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User"); 

const Donation = sequelize.define("Donation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    donor_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: User, 
            key: "id"
        },
        onDelete: "SET NULL"
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "USD"
    },
    category: {
        type: DataTypes.ENUM("general", "education", "medical", "food", "clothing"),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending"
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Donation.belongsTo(User, { foreignKey: "donor_id", onDelete: "SET NULL" });

module.exports = Donation;
