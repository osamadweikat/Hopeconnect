const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PartnershipWithdrawal = sequelize.define("PartnershipWithdrawal", {
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  withdrawal_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "processed"),
    defaultValue: "pending",
  },
}, {
  timestamps: true,
});

module.exports = PartnershipWithdrawal;
