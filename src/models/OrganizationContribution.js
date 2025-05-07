const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const OrganizationContribution = sequelize.define("OrganizationContribution", {
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orphanage_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  type: {
    type: DataTypes.ENUM("donation", "event", "project"),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = OrganizationContribution;
