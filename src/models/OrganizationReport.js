const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const OrganizationReport = sequelize.define("OrganizationReport", {
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  report_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = OrganizationReport;
