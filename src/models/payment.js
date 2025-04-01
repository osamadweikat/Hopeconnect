const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); 

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    donor_id: {
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
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending"
    }
}, {
    timestamps: true
});

module.exports = Payment;
